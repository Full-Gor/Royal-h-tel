import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, ChefHat, Coffee, Utensils, Wine, Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import { supabase } from '../lib/supabase';

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  ingredients: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  available: boolean;
  display_order: number;
}

const Menu = () => {
  const { isAdmin } = useAuth();
  const flash = useFlash();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    ingredients: '',
    category_id: '',
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false
  });

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setLoading(true);

      // Charger les catégories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('active', true)
        .order('display_order');

      if (categoriesError) {
        console.error('Erreur catégories:', categoriesError);
        flash.showError('Erreur', 'Impossible de charger les catégories');
        return;
      }

      // Charger les éléments de menu
      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('display_order');

      if (itemsError) {
        console.error('Erreur items:', itemsError);
        flash.showError('Erreur', 'Impossible de charger le menu');
        return;
      }

      setCategories(categoriesData || []);
      setMenuItems(itemsData || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      flash.showError('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      ingredients: item.ingredients.join(', '),
      category_id: item.category_id,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_gluten_free: item.is_gluten_free
    });
  };

  const handleSave = async () => {
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image_url: formData.image_url,
        ingredients: formData.ingredients.split(',').map(i => i.trim()),
        is_vegetarian: formData.is_vegetarian,
        is_vegan: formData.is_vegan,
        is_gluten_free: formData.is_gluten_free,
        updated_at: new Date().toISOString()
      };

      if (editingItem) {
        // Mise à jour
        const { error } = await supabase
          .from('menu_items')
          .update(updateData)
          .eq('id', editingItem);

        if (error) {
          console.error('Erreur mise à jour:', error);
          flash.showError('Erreur', 'Impossible de mettre à jour l\'élément');
          return;
        }

        flash.showSuccess('Succès', 'Élément mis à jour avec succès');
      } else {
        // Création
        const { error } = await supabase
          .from('menu_items')
          .insert([{
            ...updateData,
            category_id: formData.category_id,
            available: true,
            display_order: menuItems.length + 1
          }]);

        if (error) {
          console.error('Erreur création:', error);
          flash.showError('Erreur', 'Impossible de créer l\'élément');
          return;
        }

        flash.showSuccess('Succès', 'Élément créé avec succès');
      }

      setEditingItem(null);
      setShowAddForm(false);
      setFormData({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        ingredients: '',
        category_id: '',
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false
      });
      loadMenuData();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      flash.showError('Erreur', 'Une erreur est survenue');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ available: false })
        .eq('id', itemId);

      if (error) {
        console.error('Erreur suppression:', error);
        flash.showError('Erreur', 'Impossible de supprimer l\'élément');
        return;
      }

      flash.showSuccess('Succès', 'Élément supprimé avec succès');
      loadMenuData();
    } catch (error) {
      console.error('Erreur suppression:', error);
      flash.showError('Erreur', 'Une erreur est survenue');
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'petit-déjeuner':
        return Coffee;
      case 'déjeuner':
        return Utensils;
      case 'dîner':
        return ChefHat;
      case 'boissons':
        return Wine;
      default:
        return Utensils;
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement du menu...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800"
    >
      {/* Header */}
      <section className="py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ChefHat className="h-16 w-16 text-gold-500 mx-auto mb-6" />
          <h1 className="text-5xl font-serif font-bold text-white mb-4">
            Notre Menu Gastronomique
          </h1>
          <p className="text-xl text-gold-200 max-w-3xl mx-auto">
            Découvrez notre sélection de plats raffinés et de boissons d'exception
          </p>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="mt-6 bg-gold-500 hover:bg-gold-600 text-luxury-900 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un élément
            </motion.button>
          )}
        </motion.div>
      </section>

      {/* Menu par catégories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {categories.map((category, categoryIndex) => {
          const categoryItems = menuItems.filter(item => item.category_id === category.id);
          const CategoryIcon = getCategoryIcon(category.name);

          return (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <CategoryIcon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
                <h2 className="text-4xl font-serif font-bold text-white mb-4">
                  {category.name}
                </h2>
                <p className="text-gold-200 text-lg max-w-2xl mx-auto">
                  {category.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryItems.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: itemIndex * 0.1 }}
                    className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        {item.is_vegetarian && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">V</span>
                        )}
                        {item.is_vegan && (
                          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">VG</span>
                        )}
                        {item.is_gluten_free && (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">GF</span>
                        )}
                      </div>
                      {isAdmin && (
                        <div className="absolute top-4 left-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-gold-500 hover:bg-gold-600 text-luxury-900 p-2 rounded-full transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {editingItem === item.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                            placeholder="Nom du plat"
                          />
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                            placeholder="Description"
                            rows={3}
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                            className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                            placeholder="Prix"
                          />
                          <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                            className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                            placeholder="URL de l'image"
                          />
                          <input
                            type="text"
                            value={formData.ingredients}
                            onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                            className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                            placeholder="Ingrédients (séparés par des virgules)"
                          />
                          <div className="flex gap-4">
                            <label className="flex items-center text-white">
                              <input
                                type="checkbox"
                                checked={formData.is_vegetarian}
                                onChange={(e) => setFormData({...formData, is_vegetarian: e.target.checked})}
                                className="mr-2"
                              />
                              Végétarien
                            </label>
                            <label className="flex items-center text-white">
                              <input
                                type="checkbox"
                                checked={formData.is_vegan}
                                onChange={(e) => setFormData({...formData, is_vegan: e.target.checked})}
                                className="mr-2"
                              />
                              Vegan
                            </label>
                            <label className="flex items-center text-white">
                              <input
                                type="checkbox"
                                checked={formData.is_gluten_free}
                                onChange={(e) => setFormData({...formData, is_gluten_free: e.target.checked})}
                                className="mr-2"
                              />
                              Sans gluten
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSave}
                              className="flex-1 bg-gold-500 hover:bg-gold-600 text-luxury-900 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Sauvegarder
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-serif font-bold text-white">
                              {item.name}
                            </h3>
                            <span className="text-2xl font-bold text-gold-400">
                              {item.price}€
                            </span>
                          </div>
                          <p className="text-gold-200 mb-4 line-clamp-3">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.ingredients.slice(0, 4).map((ingredient, idx) => (
                              <span
                                key={idx}
                                className="bg-luxury-700/50 text-gold-300 px-2 py-1 rounded-lg text-xs"
                              >
                                {ingredient}
                              </span>
                            ))}
                            {item.ingredients.length > 4 && (
                              <span className="bg-luxury-700/50 text-gold-300 px-2 py-1 rounded-lg text-xs">
                                +{item.ingredients.length - 4} autres
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Modal d'ajout */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-luxury-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold-500/20 p-6"
          >
            <h2 className="text-2xl font-serif font-bold text-white mb-6">Ajouter un nouvel élément</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gold-200 text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                placeholder="Nom du plat"
              />
              
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                placeholder="Description"
                rows={3}
              />
              
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                placeholder="Prix"
              />
              
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                placeholder="URL de l'image"
              />
              
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-3 py-2 text-white"
                placeholder="Ingrédients (séparés par des virgules)"
              />
              
              <div className="flex gap-4">
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_vegetarian}
                    onChange={(e) => setFormData({...formData, is_vegetarian: e.target.checked})}
                    className="mr-2"
                  />
                  Végétarien
                </label>
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_vegan}
                    onChange={(e) => setFormData({...formData, is_vegan: e.target.checked})}
                    className="mr-2"
                  />
                  Vegan
                </label>
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_gluten_free}
                    onChange={(e) => setFormData({...formData, is_gluten_free: e.target.checked})}
                    className="mr-2"
                  />
                  Sans gluten
                </label>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-luxury-900 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Créer
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Annuler
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Menu;