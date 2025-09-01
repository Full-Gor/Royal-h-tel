import React, { useState, useEffect } from 'react';
import { useFlash } from '../contexts/FlashContext';
import { auditService, SecurityAlert } from '../lib/auditService';
import { AlertTriangle, CheckCircle, X, Eye, Clock, Shield } from 'lucide-react';

interface SecurityAlertsProps {
    className?: string;
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({ className = '' }) => {
    const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
    const [showModal, setShowModal] = useState(false);
    const flash = useFlash();

    useEffect(() => {
        loadAlerts();
        // Rafraîchir les alertes toutes les 30 secondes
        const interval = setInterval(loadAlerts, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadAlerts = async () => {
        try {
            setLoading(true);
            const unresolvedAlerts = await auditService.getUnresolvedAlerts();
            setAlerts(unresolvedAlerts);
        } catch (error) {
            console.error('Erreur lors du chargement des alertes:', error);
            flash.showError('Erreur', 'Impossible de charger les alertes de sécurité');
        } finally {
            setLoading(false);
        }
    };

    const handleResolveAlert = async (alertId: string) => {
        try {
            const success = await auditService.resolveAlert(alertId);
            if (success) {
                setAlerts(prev => prev.filter(alert => alert.id !== alertId));
                flash.showSuccess('Alerte résolue', 'L\'alerte a été marquée comme résolue');
            } else {
                flash.showError('Erreur', 'Impossible de résoudre l\'alerte');
            }
        } catch (error) {
            console.error('Erreur lors de la résolution:', error);
            flash.showError('Erreur', 'Une erreur est survenue');
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'high':
                return <AlertTriangle className="w-5 h-5 text-orange-600" />;
            case 'medium':
                return <Shield className="w-5 h-5 text-yellow-600" />;
            case 'low':
                return <Shield className="w-5 h-5 text-blue-600" />;
            default:
                return <Shield className="w-5 h-5 text-gray-600" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAlertTypeLabel = (alertType: string) => {
        const labels: Record<string, string> = {
            'failed_login': 'Connexion échouée',
            'admin_action': 'Action administrative',
            'payment_attempt': 'Tentative de paiement',
            'data_access': 'Accès aux données',
            'suspicious_ip': 'IP suspecte',
            'profile_modification': 'Modification de profil',
            'booking_creation': 'Création de réservation'
        };
        return labels[alertType] || alertType;
    };

    if (loading) {
        return (
            <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            {/* En-tête */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Shield className="w-6 h-6 text-red-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Alertes de Sécurité
                        </h3>
                        {alerts.length > 0 && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {alerts.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={loadAlerts}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Actualiser
                    </button>
                </div>
            </div>

            {/* Liste des alertes */}
            <div className="max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune alerte de sécurité active</p>
                        <p className="text-sm text-gray-400 mt-1">Toutes les alertes ont été résolues</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className="flex-shrink-0 mt-1">
                                            {getSeverityIcon(alert.severity)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                                                    {alert.severity.toUpperCase()}
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {getAlertTypeLabel(alert.alert_type)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {alert.description}
                                            </p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                {alert.user_email && (
                                                    <span>Utilisateur: {alert.user_email}</span>
                                                )}
                                                {alert.ip_address && (
                                                    <span>IP: {alert.ip_address}</span>
                                                )}
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatDate(alert.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedAlert(alert);
                                                setShowModal(true);
                                            }}
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                            title="Voir les détails"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleResolveAlert(alert.id)}
                                            className="p-1 text-green-600 hover:text-green-800"
                                            title="Marquer comme résolue"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de détails */}
            {showModal && selectedAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    {getSeverityIcon(selectedAlert.severity)}
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Détails de l'Alerte
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type d'alerte
                                    </label>
                                    <p className="text-sm text-gray-900">
                                        {getAlertTypeLabel(selectedAlert.alert_type)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sévérité
                                    </label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
                                        {selectedAlert.severity.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <p className="text-sm text-gray-900">
                                        {selectedAlert.description}
                                    </p>
                                </div>
                                {selectedAlert.user_email && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Utilisateur concerné
                                        </label>
                                        <p className="text-sm text-gray-900">
                                            {selectedAlert.user_email}
                                        </p>
                                    </div>
                                )}
                                {selectedAlert.ip_address && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Adresse IP
                                        </label>
                                        <p className="text-sm text-gray-900 font-mono">
                                            {selectedAlert.ip_address}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de création
                                    </label>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(selectedAlert.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={() => {
                                    handleResolveAlert(selectedAlert.id);
                                    setShowModal(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md flex items-center space-x-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Marquer comme résolue</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecurityAlerts;
