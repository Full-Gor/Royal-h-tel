-- Migration: Système d'Audit et Journalisation - Château Royal
-- Date: 2025-07-02
-- Description: Ajout d'un système complet d'audit avec détection de comportements suspects

-- =====================================================
-- 1. TABLE D'AUDIT PRINCIPALE
-- =====================================================

CREATE TABLE audit_logs (
    id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id uuid REFERENCES auth.users (id),
    session_id text,
    action_type text NOT NULL,
    table_name text,
    record_id text,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    success boolean DEFAULT true,
    error_message text,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- Index pour les performances
CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id);

CREATE INDEX idx_audit_logs_action_type ON audit_logs (action_type);

CREATE INDEX idx_audit_logs_table_name ON audit_logs (table_name);

CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);

CREATE INDEX idx_audit_logs_ip_address ON audit_logs (ip_address);

-- =====================================================
-- 2. TABLE D'ALERTES DE SÉCURITÉ
-- =====================================================

CREATE TABLE security_alerts (
    id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
    alert_type text NOT NULL,
    severity text NOT NULL CHECK (
        severity IN (
            'low',
            'medium',
            'high',
            'critical'
        )
    ),
    user_id uuid REFERENCES auth.users (id),
    ip_address inet,
    description text NOT NULL,
    metadata jsonb,
    resolved boolean DEFAULT false,
    resolved_by uuid REFERENCES auth.users (id),
    resolved_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Index pour les alertes
CREATE INDEX idx_security_alerts_type ON security_alerts (alert_type);

CREATE INDEX idx_security_alerts_severity ON security_alerts (severity);

CREATE INDEX idx_security_alerts_user_id ON security_alerts (user_id);

CREATE INDEX idx_security_alerts_resolved ON security_alerts (resolved);

CREATE INDEX idx_security_alerts_created_at ON security_alerts (created_at);

-- =====================================================
-- 3. TABLE DE CONFIGURATION DES ALERTES
-- =====================================================

CREATE TABLE alert_config (
    id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
    alert_type text UNIQUE NOT NULL,
    enabled boolean DEFAULT true,
    threshold integer DEFAULT 1,
    time_window_minutes integer DEFAULT 60,
    severity text DEFAULT 'medium',
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Configuration par défaut des alertes
INSERT INTO
    alert_config (
        alert_type,
        threshold,
        time_window_minutes,
        severity,
        description
    )
VALUES (
        'failed_login',
        5,
        15,
        'high',
        'Tentatives de connexion échouées'
    ),
    (
        'admin_action',
        10,
        5,
        'medium',
        'Actions administratives fréquentes'
    ),
    (
        'payment_attempt',
        3,
        10,
        'high',
        'Tentatives de paiement fréquentes'
    ),
    (
        'data_access',
        50,
        5,
        'medium',
        'Accès aux données fréquents'
    ),
    (
        'suspicious_ip',
        1,
        60,
        'critical',
        'IP suspecte détectée'
    ),
    (
        'profile_modification',
        5,
        10,
        'medium',
        'Modifications de profil fréquentes'
    ),
    (
        'booking_creation',
        3,
        5,
        'medium',
        'Créations de réservations fréquentes'
    );

-- =====================================================
-- 4. FONCTION DE JOURNALISATION AUTOMATIQUE
-- =====================================================

CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS trigger AS $$
DECLARE
  v_user_id uuid;
  v_session_id text;
  v_ip_address inet;
  v_user_agent text;
  v_old_values jsonb;
  v_new_values jsonb;
BEGIN
  -- Récupérer les informations de session
  v_user_id := auth.uid();
  v_session_id := current_setting('request.headers', true)::json->>'x-session-id';
  v_ip_address := inet_client_addr();
  v_user_agent := current_setting('request.headers', true)::json->>'user-agent';
  
  -- Préparer les valeurs selon le type d'action
  CASE TG_OP
    WHEN 'INSERT' THEN
      v_new_values := to_jsonb(NEW);
      v_old_values := NULL;
    WHEN 'UPDATE' THEN
      v_old_values := to_jsonb(OLD);
      v_new_values := to_jsonb(NEW);
    WHEN 'DELETE' THEN
      v_old_values := to_jsonb(OLD);
      v_new_values := NULL;
  END CASE;
  
  -- Insérer l'événement d'audit
  INSERT INTO audit_logs (
    user_id,
    session_id,
    action_type,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    v_user_id,
    v_session_id,
    TG_OP,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id::text
      ELSE NEW.id::text
    END,
    v_old_values,
    v_new_values,
    v_ip_address,
    v_user_agent,
    jsonb_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. FONCTION DE DÉTECTION DE COMPORTEMENTS SUSPECTS
-- =====================================================

CREATE OR REPLACE FUNCTION detect_suspicious_behavior()
RETURNS void AS $$
DECLARE
  alert_record record;
  config_record record;
  event_count integer;
  v_user_id uuid;
  v_ip_address inet;
BEGIN
  -- Récupérer l'utilisateur et l'IP actuels
  v_user_id := auth.uid();
  v_ip_address := inet_client_addr();
  
  -- Vérifier les tentatives de connexion échouées
  SELECT * INTO config_record FROM alert_config WHERE alert_type = 'failed_login' AND enabled = true;
  IF FOUND THEN
    SELECT COUNT(*) INTO event_count
    FROM audit_logs
    WHERE action_type = 'LOGIN_FAILED'
      AND user_id = v_user_id
      AND created_at > now() - interval '1 minute' * config_record.time_window_minutes;
    
    IF event_count >= config_record.threshold THEN
      INSERT INTO security_alerts (alert_type, severity, user_id, ip_address, description, metadata)
      VALUES (
        'failed_login',
        config_record.severity,
        v_user_id,
        v_ip_address,
        format('Tentatives de connexion échouées: %s dans les %s dernières minutes', event_count, config_record.time_window_minutes),
        jsonb_build_object('event_count', event_count, 'time_window', config_record.time_window_minutes)
      );
    END IF;
  END IF;
  
  -- Vérifier les actions administratives fréquentes
  SELECT * INTO config_record FROM alert_config WHERE alert_type = 'admin_action' AND enabled = true;
  IF FOUND THEN
    SELECT COUNT(*) INTO event_count
    FROM audit_logs al
    JOIN profiles p ON al.user_id = p.id
    WHERE p.is_admin = true
      AND al.user_id = v_user_id
      AND al.created_at > now() - interval '1 minute' * config_record.time_window_minutes;
    
    IF event_count >= config_record.threshold THEN
      INSERT INTO security_alerts (alert_type, severity, user_id, ip_address, description, metadata)
      VALUES (
        'admin_action',
        config_record.severity,
        v_user_id,
        v_ip_address,
        format('Actions administratives fréquentes: %s dans les %s dernières minutes', event_count, config_record.time_window_minutes),
        jsonb_build_object('event_count', event_count, 'time_window', config_record.time_window_minutes)
      );
    END IF;
  END IF;
  
  -- Vérifier les tentatives de paiement fréquentes
  SELECT * INTO config_record FROM alert_config WHERE alert_type = 'payment_attempt' AND enabled = true;
  IF FOUND THEN
    SELECT COUNT(*) INTO event_count
    FROM audit_logs
    WHERE action_type = 'PAYMENT_ATTEMPT'
      AND user_id = v_user_id
      AND created_at > now() - interval '1 minute' * config_record.time_window_minutes;
    
    IF event_count >= config_record.threshold THEN
      INSERT INTO security_alerts (alert_type, severity, user_id, ip_address, description, metadata)
      VALUES (
        'payment_attempt',
        config_record.severity,
        v_user_id,
        v_ip_address,
        format('Tentatives de paiement fréquentes: %s dans les %s dernières minutes', event_count, config_record.time_window_minutes),
        jsonb_build_object('event_count', event_count, 'time_window', config_record.time_window_minutes)
      );
    END IF;
  END IF;
  
  -- Vérifier les IPs suspectes (géolocalisation, proxy, etc.)
  -- Note: Cette vérification nécessiterait une API externe pour une implémentation complète
  IF v_ip_address IS NOT NULL THEN
    -- Vérifier si cette IP a déjà généré des alertes récemment
    SELECT COUNT(*) INTO event_count
    FROM security_alerts
    WHERE ip_address = v_ip_address
      AND alert_type = 'suspicious_ip'
      AND created_at > now() - interval '1 hour';
    
    IF event_count = 0 THEN
      -- Ici on pourrait ajouter une vérification avec une API de réputation d'IP
      -- Pour l'instant, on vérifie juste si l'IP est dans une plage privée suspecte
      IF v_ip_address <<= inet '10.0.0.0/8' OR 
         v_ip_address <<= inet '172.16.0.0/12' OR 
         v_ip_address <<= inet '192.168.0.0/16' THEN
        
        INSERT INTO security_alerts (alert_type, severity, user_id, ip_address, description, metadata)
        VALUES (
          'suspicious_ip',
          'medium',
          v_user_id,
          v_ip_address,
          format('IP privée détectée: %s', v_ip_address),
          jsonb_build_object('ip_type', 'private', 'ip_address', v_ip_address::text)
        );
      END IF;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. FONCTION DE JOURNALISATION DES ÉVÉNEMENTS D'AUTH
-- =====================================================

CREATE OR REPLACE FUNCTION log_auth_event(event_type text, success boolean DEFAULT true, error_message text DEFAULT NULL)
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  v_session_id text;
  v_ip_address inet;
  v_user_agent text;
BEGIN
  -- Récupérer les informations de session
  v_user_id := auth.uid();
  v_session_id := current_setting('request.headers', true)::json->>'x-session-id';
  v_ip_address := inet_client_addr();
  v_user_agent := current_setting('request.headers', true)::json->>'user-agent';
  
  -- Insérer l'événement d'authentification
  INSERT INTO audit_logs (
    user_id,
    session_id,
    action_type,
    ip_address,
    user_agent,
    success,
    error_message,
    metadata
  ) VALUES (
    v_user_id,
    v_session_id,
    event_type,
    v_ip_address,
    v_user_agent,
    success,
    error_message,
    jsonb_build_object(
      'event_type', event_type,
      'timestamp', now(),
      'success', success
    )
  );
  
  -- Détecter les comportements suspects
  PERFORM detect_suspicious_behavior();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. TRIGGERS POUR LES TABLES SENSIBLES
-- =====================================================

-- Trigger pour les profils
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Trigger pour les réservations
CREATE TRIGGER audit_bookings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Trigger pour les chambres
CREATE TRIGGER audit_rooms_trigger
  AFTER INSERT OR UPDATE OR DELETE ON rooms
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Trigger pour les messages de contact
CREATE TRIGGER audit_contact_messages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- =====================================================
-- 8. FONCTIONS UTILITAIRES POUR L'ADMIN
-- =====================================================

-- Fonction pour obtenir les alertes non résolues
CREATE OR REPLACE FUNCTION get_unresolved_alerts()
RETURNS TABLE (
  id uuid,
  alert_type text,
  severity text,
  user_email text,
  ip_address inet,
  description text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.id,
    sa.alert_type,
    sa.severity,
    au.email as user_email,
    sa.ip_address,
    sa.description,
    sa.created_at
  FROM security_alerts sa
  LEFT JOIN auth.users au ON sa.user_id = au.id
  WHERE sa.resolved = false
  ORDER BY sa.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour résoudre une alerte
CREATE OR REPLACE FUNCTION resolve_alert(alert_id uuid, resolved_by_user_id uuid)
RETURNS boolean AS $$
BEGIN
  UPDATE security_alerts
  SET resolved = true,
      resolved_by = resolved_by_user_id,
      resolved_at = now()
  WHERE id = alert_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques d'audit
CREATE OR REPLACE FUNCTION get_audit_stats(days_back integer DEFAULT 7)
RETURNS TABLE (
  total_events bigint,
  failed_events bigint,
  unique_users bigint,
  unique_ips bigint,
  most_common_action text,
  most_active_user text
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT 
      COUNT(*) as total_events,
      COUNT(*) FILTER (WHERE success = false) as failed_events,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(DISTINCT ip_address) as unique_ips
    FROM audit_logs
    WHERE created_at > now() - interval '1 day' * days_back
  ),
  action_stats AS (
    SELECT action_type, COUNT(*) as action_count
    FROM audit_logs
    WHERE created_at > now() - interval '1 day' * days_back
    GROUP BY action_type
    ORDER BY action_count DESC
    LIMIT 1
  ),
  user_stats AS (
    SELECT au.email, COUNT(*) as user_action_count
    FROM audit_logs al
    JOIN auth.users au ON al.user_id = au.id
    WHERE al.created_at > now() - interval '1 day' * days_back
    GROUP BY au.email
    ORDER BY user_action_count DESC
    LIMIT 1
  )
  SELECT 
    s.total_events,
    s.failed_events,
    s.unique_users,
    s.unique_ips,
    ac.action_type as most_common_action,
    us.email as most_active_user
  FROM stats s
  LEFT JOIN action_stats ac ON true
  LEFT JOIN user_stats us ON true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. POLITIQUES RLS POUR LES TABLES D'AUDIT
-- =====================================================

-- Activer RLS sur les tables d'audit
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

ALTER TABLE alert_config ENABLE ROW LEVEL SECURITY;

-- Politiques pour audit_logs (lecture admin uniquement)
CREATE POLICY "Admins can read audit logs" ON audit_logs FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE
                profiles.id = auth.uid ()
                AND profiles.is_admin = true
        )
    );

-- Politiques pour security_alerts (lecture et modification admin uniquement)
CREATE POLICY "Admins can read security alerts" ON security_alerts FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE
                profiles.id = auth.uid ()
                AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can update security alerts" ON security_alerts FOR
UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE
            profiles.id = auth.uid ()
            AND profiles.is_admin = true
    )
);

-- Politiques pour alert_config (lecture admin, modification système uniquement)
CREATE POLICY "Admins can read alert config" ON alert_config FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE
                profiles.id = auth.uid ()
                AND profiles.is_admin = true
        )
    );

-- =====================================================
-- 10. COMMENTAIRES ET DOCUMENTATION
-- =====================================================

COMMENT ON
TABLE audit_logs IS 'Journal d''audit complet pour toutes les actions sensibles';

COMMENT ON
TABLE security_alerts IS 'Alertes de sécurité générées automatiquement';

COMMENT ON
TABLE alert_config IS 'Configuration des seuils et paramètres d''alertes';

COMMENT ON FUNCTION log_audit_event () IS 'Fonction trigger pour journaliser automatiquement les événements';

COMMENT ON FUNCTION detect_suspicious_behavior () IS 'Fonction de détection de comportements suspects';

COMMENT ON FUNCTION log_auth_event (text, boolean, text) IS 'Fonction pour journaliser les événements d''authentification';

-- =====================================================
-- 11. NETTOYAGE AUTOMATIQUE (OPTIONNEL)
-- =====================================================

-- Fonction pour nettoyer les anciens logs (à exécuter périodiquement)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(days_to_keep integer DEFAULT 90)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM audit_logs 
  WHERE created_at < now() - interval '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour nettoyer les anciennes alertes résolues
CREATE OR REPLACE FUNCTION cleanup_resolved_alerts(days_to_keep integer DEFAULT 30)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM security_alerts 
  WHERE resolved = true 
    AND resolved_at < now() - interval '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;