const translations = {
  English: {
    // Sidebar
    'inventory_dashboard': 'Inventory Dashboard',
    'receive_stock': 'Receive Stock',
    'point_of_sale': 'Point of Sale',
    'quick_price_check': 'Quick Price Check',
    'feedback': 'Feedback',
    'settings': 'Settings',
    'sign_out': 'Sign Out',
    
    // Inventory
    'current_inventory': 'Current Inventory',
    'add_new_medicine': 'Add New Medicine',
    'search_inventory': 'Search inventory...',
    'no_medicines_found': 'No medicines found matching your search.',
    'db_empty': 'Your inventory database is currently empty.',
    'stock_low': 'Low Stock',
    'stock_ok': 'In Stock',
    'edit': 'Edit',
    'delete': 'Delete',

    // Receive Stock
    'receive_new_stock': 'Receive New Stock',
    'medicine_details': 'Medicine Details',
    'medicine_name': 'Medicine Name',
    'description': 'Description',
    'unit_price': 'Unit Price ($)',
    'expiry_date': 'Expiry Date',
    'prescription_required': 'Prescription Required',
    'initial_stock': 'Initial Stock Quantity',
    'add_to_inventory': 'Add to Inventory',
    
    // Point of Sale
    'buyer_name': 'Buyer / Patient Name',
    'search_live_inventory': 'Search Live Inventory',
    'qty_to_deduct': 'Qty to Deduct',
    'add_to_cart': 'Add Item to Cart',
    'pending_transaction': 'Pending Transaction',
    'remove': 'Remove',
    'grand_total': 'Grand Total Due:',
    'finalize_sale': 'Finalize Complete Sale',
    'processing': 'Processing Database Transactions...',
    
    // Quick Price Check
    'price_calculator': 'Price Calculator',
    'price_check_desc': 'Check prices instantly without affecting inventory or recording a sale.',
    'quick_sale_desc': 'Check prices, build a cart, and process a sale without needing a Patient Name.',
    'quick_sale_transaction': 'Quick Sale Transaction',
    'finalize_quick_sale': 'Finalize Quick Sale',
    'processing_quick_sale': 'Processing Quick Sale...',
    'reset_cart': 'Reset Cart',
    'estimated_total': 'Estimated Total:',
    
    // Settings
    'settings_configuration': 'Settings & Configuration',
    'user_profile': 'User Profile',
    'display_name': 'Display Name',
    'email_address': 'Email Address',
    'update_profile': 'Update Profile',
    'change_password': 'Change Password',
    'current_password': 'Current Password',
    'new_password': 'New Password',
    'pharmacy_info': 'Pharmacy Information',
    'pharmacy_name': 'Pharmacy Name',
    'official_address': 'Official Address',
    'contact_number': 'Contact Number',
    'save_pharmacy_details': 'Save Pharmacy Details',
    'appearance_regional': 'Appearance & Regional',
    'dark_mode': 'Dark Mode',
    'interface_language': 'Interface Language',
    'data_management': 'Data Management',
    'export_inventory': 'Export Full Inventory to CSV',
    'export_sales': 'Export Sales History to CSV',
    
    // Feedback Form
    'feedback_form_title': 'Submit Feedback',
    'category': 'Category',
    'subject': 'Subject',
    'feedback_description': 'Description',
    'send_feedback': 'Send Feedback',
    'bug': 'Bug',
    'improvement': 'Improvement',
    'question': 'Question',
    'other': 'Other',
    'feedback_success': 'Thank you! Your feedback has been sent to the Admin.'
  },
  French: {
    // Sidebar
    'inventory_dashboard': 'Tableau de Bord',
    'receive_stock': 'Recevoir du Stock',
    'point_of_sale': 'Point de Vente',
    'quick_price_check': 'Vérification Rapide',
    'feedback': 'Commentaires',
    'settings': 'Paramètres',
    'sign_out': 'Déconnexion',
    
    // Inventory
    'current_inventory': 'Inventaire Actuel',
    'add_new_medicine': 'Ajouter un Médicament',
    'search_inventory': 'Rechercher dans l\'inventaire...',
    'no_medicines_found': 'Aucun médicament trouvé.',
    'db_empty': 'Votre base de données d\'inventaire est vide.',
    'stock_low': 'Stock Faible',
    'stock_ok': 'En Stock',
    'edit': 'Modifier',
    'delete': 'Supprimer',

    // Receive Stock
    'receive_new_stock': 'Recevoir Nouveau Stock',
    'medicine_details': 'Détails du Médicament',
    'medicine_name': 'Nom du Médicament',
    'description': 'Description',
    'unit_price': 'Prix Unitaire ($)',
    'expiry_date': 'Date d\'Expiration',
    'prescription_required': 'Ordonnance Requise',
    'initial_stock': 'Quantité Initiale',
    'add_to_inventory': 'Ajouter à l\'Inventaire',
    
    // Point of Sale
    'buyer_name': 'Nom de l\'Acheteur / Patient',
    'search_live_inventory': 'Rechercher dans l\'Inventaire',
    'qty_to_deduct': 'Qté à Déduire',
    'add_to_cart': 'Ajouter au Panier',
    'pending_transaction': 'Transaction en Attente',
    'remove': 'Retirer',
    'grand_total': 'Total à Payer:',
    'finalize_sale': 'Finaliser la Vente',
    'processing': 'Traitement en Cours...',
    
    // Quick Price Check
    'price_calculator': 'Calculateur de Prix',
    'price_check_desc': 'Vérifiez les prix instantanément sans affecter l\'inventaire ni enregistrer de vente.',
    'quick_sale_desc': 'Vérifiez les prix, créez un panier et traitez une vente sans nom de patient.',
    'quick_sale_transaction': 'Transaction Rapide',
    'finalize_quick_sale': 'Finaliser la Vente Rapide',
    'processing_quick_sale': 'Traitement de la Vente...',
    'reset_cart': 'Réinitialiser',
    'estimated_total': 'Total Estimé:',
    
    // Settings
    'settings_configuration': 'Paramètres et Configuration',
    'user_profile': 'Profil Utilisateur',
    'display_name': 'Nom d\'Affichage',
    'email_address': 'Adresse Email',
    'update_profile': 'Mettre à Jour le Profil',
    'change_password': 'Changer le Mot de Passe',
    'current_password': 'Mot de Passe Actuel',
    'new_password': 'Nouveau Mot de Passe',
    'pharmacy_info': 'Informations sur la Pharmacie',
    'pharmacy_name': 'Nom de la Pharmacie',
    'official_address': 'Adresse Officielle',
    'contact_number': 'Numéro de Contact',
    'save_pharmacy_details': 'Enregistrer les Détails',
    'appearance_regional': 'Apparence et Région',
    'dark_mode': 'Mode Sombre',
    'interface_language': 'Langue de l\'Interface',
    'data_management': 'Gestion des Données',
    'export_inventory': 'Exporter l\'Inventaire en CSV',
    'export_sales': 'Exporter l\'Historique des Ventes',
    
    // Feedback Form
    'feedback_form_title': 'Soumettre des Commentaires',
    'category': 'Catégorie',
    'subject': 'Sujet',
    'feedback_description': 'Description',
    'send_feedback': 'Envoyer',
    'bug': 'Bogue',
    'improvement': 'Amélioration',
    'question': 'Question',
    'other': 'Autre',
    'feedback_success': 'Merci! Vos commentaires ont été envoyés à l\'administrateur.'
  },
  Arabic: {
    // Sidebar
    'inventory_dashboard': 'لوحة تحكم المخزون',
    'receive_stock': 'استلام المخزون',
    'point_of_sale': 'نقطة البيع',
    'quick_price_check': 'التحقق السريع من السعر',
    'feedback': 'التعليقات',
    'settings': 'الإعدادات',
    'sign_out': 'تسجيل الخروج',
    
    // Inventory
    'current_inventory': 'المخزون الحالي',
    'add_new_medicine': 'إضافة دواء جديد',
    'search_inventory': 'البحث في المخزون...',
    'no_medicines_found': 'لم يتم العثور على أدوية مطابقة للبحث.',
    'db_empty': 'قاعدة بيانات المخزون فارغة حالياً.',
    'stock_low': 'مخزون منخفض',
    'stock_ok': 'متوفر',
    'edit': 'تعديل',
    'delete': 'حذف',

    // Receive Stock
    'receive_new_stock': 'استلام مخزون جديد',
    'medicine_details': 'تفاصيل الدواء',
    'medicine_name': 'اسم الدواء',
    'description': 'الوصف',
    'unit_price': 'سعر الوحدة ($)',
    'expiry_date': 'تاريخ الانتهاء',
    'prescription_required': 'يتطلب وصفة طبية',
    'initial_stock': 'الكمية الأولية للمخزون',
    'add_to_inventory': 'إضافة إلى المخزون',
    
    // Point of Sale
    'buyer_name': 'اسم المشتري / المريض',
    'search_live_inventory': 'البحث المباشر في المخزون',
    'qty_to_deduct': 'الكمية المراد خصمها',
    'add_to_cart': 'أضف العنصر إلى السلة',
    'pending_transaction': 'معاملة معلقة',
    'remove': 'إزالة',
    'grand_total': 'المجموع الإجمالي المستحق:',
    'finalize_sale': 'إتمام البيع',
    'processing': 'جاري معالجة المعاملة...',
    
    // Quick Price Check
    'price_calculator': 'حاسبة الأسعار',
    'price_check_desc': 'تحقق من الأسعار فوراً دون التأثير على المخزون أو تسجيل البيع.',
    'quick_sale_desc': 'تحقق من الأسعار، قم ببناء سلة، ومعالجة عملية بيع دون الحاجة إلى اسم المريض.',
    'quick_sale_transaction': 'معاملة بيع سريعة',
    'finalize_quick_sale': 'إتمام البيع السريع',
    'processing_quick_sale': 'جاري معالجة البيع السريع...',
    'reset_cart': 'إفراغ السلة',
    'estimated_total': 'المجموع المقدر:',
    
    // Settings
    'settings_configuration': 'الإعدادات والتكوين',
    'user_profile': 'ملف المستخدم',
    'display_name': 'اسم العرض',
    'email_address': 'البريد الإلكتروني',
    'update_profile': 'تحديث الملف الشخصي',
    'change_password': 'تغيير كلمة المرور',
    'current_password': 'كلمة المرور الحالية',
    'new_password': 'كلمة المرور الجديدة',
    'pharmacy_info': 'معلومات الصيدلية',
    'pharmacy_name': 'اسم الصيدلية',
    'official_address': 'العنوان الرسمي',
    'contact_number': 'رقم الاتصال',
    'save_pharmacy_details': 'حفظ بيانات الصيدلية',
    'appearance_regional': 'المظهر والمنطقة',
    'dark_mode': 'الوضع الداكن',
    'interface_language': 'لغة الواجهة',
    'data_management': 'إدارة البيانات',
    'export_inventory': 'تصدير كامل المخزون إلى CSV',
    'export_sales': 'تصدير سجل المبيعات إلى CSV',
    
    // Feedback Form
    'feedback_form_title': 'إرسال ملاحظات',
    'category': 'الفئة',
    'subject': 'الموضوع',
    'feedback_description': 'الوصف',
    'send_feedback': 'إرسال',
    'bug': 'مشكلة',
    'improvement': 'تحسين',
    'question': 'سؤال',
    'other': 'أخرى',
    'feedback_success': 'شكرًا لك! تم إرسال ملاحظاتك إلى المسؤول.'
  }
};

export function t(key: string): string {
  const lang = localStorage.getItem('appLanguage') || 'English';
  // @ts-ignore
  const dict = translations[lang] || translations['English'];
  return dict[key] || key;
}
