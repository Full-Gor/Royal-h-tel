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
        console.log('Chargement des données de démonstration du menu...');
        const demoData = getDemoMenuData();
        setCategories(demoData.categories);
        setMenuItems(demoData.items);
        setLoading(false);
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
        console.log('Chargement des données de démonstration du menu...');
        const demoData = getDemoMenuData();
        setCategories(demoData.categories);
        setMenuItems(demoData.items);
        setLoading(false);
        return;
      }

      if (!categoriesData || categoriesData.length === 0 || !itemsData || itemsData.length === 0) {
        const demoData = getDemoMenuData();
        setCategories(demoData.categories);
        setMenuItems(demoData.items);
      } else {
        setCategories(categoriesData || []);
        setMenuItems(itemsData || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      const demoData = getDemoMenuData();
      setCategories(demoData.categories);
      setMenuItems(demoData.items);
    } finally {
      setLoading(false);
    }
  };

  const getDemoMenuData = () => {
    const demoCategories: MenuCategory[] = [
      {
        id: 'cat-1',
        name: 'Petit-Déjeuner',
        description: 'Commencez votre journée avec nos délicieux petits-déjeuners préparés avec des produits frais et locaux',
        display_order: 1
      },
      {
        id: 'cat-2',
        name: 'Déjeuner',
        description: 'Découvrez nos plats raffinés pour un déjeuner d\'exception',
        display_order: 2
      },
      {
        id: 'cat-3',
        name: 'Dîner',
        description: 'Une expérience gastronomique inoubliable pour vos soirées',
        display_order: 3
      },
      {
        id: 'cat-4',
        name: 'Boissons',
        description: 'Sélection de vins fins, cocktails signatures et boissons premium',
        display_order: 4
      }
    ];

    const demoItems: MenuItem[] = [
      // Petit-Déjeuner
      {
        id: 'item-1',
        category_id: 'cat-1',
        name: 'Petit-Déjeuner Continental',
        description: 'Viennoiseries fraîches, confitures maison, jus d\'orange pressé, café ou thé. Pain frais du boulanger, beurre et miel de notre rucher.',
        price: 22,
        image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Croissants', 'Pain au chocolat', 'Confitures maison', 'Jus d\'orange', 'Café', 'Thé'],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false,
        available: true,
        display_order: 1
      },
      {
        id: 'item-2',
        category_id: 'cat-1',
        name: 'Petit-Déjeuner Anglais',
        description: 'Œufs brouillés crémeux, bacon croustillant, saucisses artisanales, champignons sautés, tomates rôties, haricots blancs et toast.',
        price: 28,
        image_url: 'https://images.pexels.com/photos/2662875/pexels-photo-2662875.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Œufs', 'Bacon', 'Saucisses', 'Champignons', 'Tomates', 'Haricots'],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        available: true,
        display_order: 2
      },
      {
        id: 'item-3',
        category_id: 'cat-1',
        name: 'Pancakes aux Fruits Rouges',
        description: 'Pancakes moelleux garnis de fruits rouges frais, sirop d\'érable pur, crème chantilly légère et éclats d\'amandes grillées.',
        price: 18,
        image_url: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Pancakes', 'Fruits rouges', 'Sirop d\'érable', 'Crème', 'Amandes'],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false,
        available: true,
        display_order: 3
      },
      // Déjeuner
      {
        id: 'item-4',
        category_id: 'cat-2',
        name: 'Salade César Royale',
        description: 'Salade romaine croquante, poulet grillé mariné, parmesan AOP, croûtons dorés maison, sauce César crémeuse aux anchois.',
        price: 24,
        image_url: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Salade romaine', 'Poulet', 'Parmesan', 'Croûtons', 'Anchois', 'Sauce César'],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        available: true,
        display_order: 4
      },
      {
        id: 'item-5',
        category_id: 'cat-2',
        name: 'Risotto aux Cèpes',
        description: 'Riz Carnaroli crémeux, cèpes sauvages, parmesan Reggiano, truffe noire, bouillon de légumes maison. Un délice onctueux.',
        price: 32,
        image_url: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Riz Carnaroli', 'Cèpes', 'Parmesan', 'Truffe', 'Vin blanc', 'Bouillon'],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: true,
        available: true,
        display_order: 5
      },
      {
        id: 'item-6',
        category_id: 'cat-2',
        name: 'Pavé de Saumon Grillé',
        description: 'Saumon norvégien grillé à la perfection, légumes de saison rôtis, sauce citron-aneth, purée de pommes de terre à l\'huile d\'olive.',
        price: 36,
        image_url: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Saumon', 'Légumes', 'Citron', 'Aneth', 'Pommes de terre', 'Huile d\'olive'],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: true,
        available: true,
        display_order: 6
      },
      // Dîner
      {
        id: 'item-7',
        category_id: 'cat-3',
        name: 'Filet de Bœuf Rossini',
        description: 'Filet de bœuf français Label Rouge, foie gras poêlé, truffe noire, sauce Périgueux, gratin dauphinois crémeux.',
        price: 58,
        image_url: 'https://images.pexels.com/photos/2613157/pexels-photo-2613157.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Filet de bœuf', 'Foie gras', 'Truffe', 'Pommes de terre', 'Crème', 'Vin rouge'],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: true,
        available: true,
        display_order: 7
      },
      {
        id: 'item-8',
        category_id: 'cat-3',
        name: 'Homard Thermidor',
        description: 'Homard breton entier gratiné, sauce crémeuse au cognac, moutarde de Dijon, parmesan, accompagné de légumes fins et riz sauvage.',
        price: 68,
        image_url: 'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Homard', 'Cognac', 'Crème', 'Moutarde', 'Parmesan', 'Riz sauvage'],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: true,
        available: true,
        display_order: 8
      },
      {
        id: 'item-9',
        category_id: 'cat-3',
        name: 'Magret de Canard aux Cerises',
        description: 'Magret de canard du Sud-Ouest, cerises noires confites, sauce au vin rouge, légumes glacés, pommes sarladaises croustillantes.',
        price: 42,
        image_url: 'https://images.pexels.com/photos/6210746/pexels-photo-6210746.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Magret de canard', 'Cerises', 'Vin rouge', 'Légumes', 'Pommes de terre', 'Graisse de canard'],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: true,
        available: true,
        display_order: 9
      },
      {
        id: 'item-10',
        category_id: 'cat-3',
        name: 'Assiette Végétarienne Gastronomique',
        description: 'Légumes bio de saison rôtis et grillés, quinoa aux herbes, houmous maison, tempeh mariné, sauce tahini citronnée.',
        price: 34,
        image_url: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Légumes bio', 'Quinoa', 'Pois chiches', 'Tempeh', 'Tahini', 'Herbes fraîches'],
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: true,
        available: true,
        display_order: 10
      },
      // Boissons
      {
        id: 'item-11',
        category_id: 'cat-4',
        name: 'Château Margaux 2015',
        description: 'Grand cru classé de Bordeaux, vin rouge d\'exception aux arômes complexes de fruits noirs, épices et notes boisées. Parfait avec nos viandes.',
        price: 280,
        image_url: 'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc', 'Petit Verdot'],
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: true,
        available: true,
        display_order: 11
      },
      {
        id: 'item-12',
        category_id: 'cat-4',
        name: 'Champagne Dom Pérignon',
        description: 'Champagne millésimé d\'exception, bulles fines et persistantes, arômes de fleurs blanches, noisettes grillées et agrumes confits.',
        price: 320,
        image_url: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Chardonnay', 'Pinot Noir'],
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: true,
        available: true,
        display_order: 12
      },
      {
        id: 'item-13',
        category_id: 'cat-4',
        name: 'Cocktail Royal Signature',
        description: 'Notre cocktail maison exclusif : champagne rosé, liqueur de framboise artisanale, jus de citron frais, sirop de violette, pétales comestibles.',
        price: 18,
        image_url: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Champagne rosé', 'Liqueur framboise', 'Citron', 'Violette', 'Pétales de rose'],
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: true,
        available: true,
        display_order: 13
      },
      {
        id: 'item-14',
        category_id: 'cat-4',
        name: 'Whisky Single Malt 25 ans',
        description: 'Whisky écossais rare vieilli 25 ans en fûts de chêne, notes de miel, caramel, tourbe légère et fruits secs. Dégustation exceptionnelle.',
        price: 45,
        image_url: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ingredients: ['Orge maltée', 'Eau de source écossaise'],
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: false,
        available: true,
        display_order: 14
      }
    ];

    return { categories: demoCategories, items: demoItems };
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