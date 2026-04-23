export const about = {
    // ABOUT
    about_title: 'About',
    about_version: 'Version 1.0.0',
    about_tag_tuyo: 'Tuyo Management',
    about_tag_drying: 'Fish Drying',
    about_description: 'Designed to assist tuyo producers in monitoring, managing, and improving the sun-drying process through data-driven tools and intelligent analysis. Integrates weather forecasting, drying area management, and image-based scanning to help users make informed decisions.',
    about_features_title: 'Key Features',
    about_contact_title: 'Contact',
    about_contact_body: 'For issues not covered in the Help Center or feedback about the app, contact the developer through the official project channels.',
    about_feature_weather_label: 'Weather Alerts',
    about_feature_weather_desc: 'Real-time drying recommendations based on forecast data',
    about_feature_tray_label: 'Tray Management',
    about_feature_tray_desc: 'Drying area and tray tracking with role-based access',
    about_feature_scan_label: 'Image Scanning',
    about_feature_scan_desc: 'Quality assessment of dried fish via image analysis',
    about_feature_notif_label: 'Notifications',
    about_feature_notif_desc: 'Alerts for drying activities and announcements',
}

export const faq = {
    // FAQ screen
    faq_title: 'FAQ',

    // Categories
    faq_category_technical: 'Technical & Scanning',
    faq_category_quality: 'Quality & Monitoring',
    faq_category_environmental: 'Environmental Factors',
    faq_category_data: 'Data & History',
    faq_category_account: 'Account & Support',

    // Technical & Scanning
    faq_q_lighting: 'What is the ideal lighting and distance for a scan?',
    faq_a_lighting_1: 'Use natural daylight or bright, even artificial lighting.',
    faq_a_lighting_2: 'Hold the camera 30–50 cm away from the drying rack.',
    faq_a_lighting_3: 'Avoid shadows or direct glare on the fish surface.',

    faq_q_offline: 'Does the system work without an internet connection?',
    faq_a_offline_1: 'An active internet connection is required to use the app.',
    faq_a_offline_2: 'Scanning, species recognition, and data sync all rely on internet access.',
    faq_a_offline_3: 'Please ensure you are connected before starting a session.',

    // Quality & Monitoring
    faq_q_harvest_readiness: 'What parameters determine "Harvest Readiness"?',
    faq_a_harvest_readiness_1: 'Color, and texture are the primary indicators.',
    faq_a_harvest_readiness_2: 'The app cross-references these with species-specific drying standards.',
    faq_a_harvest_readiness_3: 'A readiness score is calculated after each scan.',

    faq_q_quality_change: 'Why did the quality assessment change between scans?',
    faq_a_quality_change_1: 'Environmental changes like humidity can affect drying progress.',
    faq_a_quality_change_2: 'Scan angle and lighting differences may influence results.',
    faq_a_quality_change_3: 'Multiple scans over time provide a more accurate trend.',

    faq_q_species: 'Which specific fish species are currently supported?',
    faq_a_species_1: 'The app currently supports one species: Sardinella fimbriata, locally known as Law-law or Tuyo.',
    faq_a_species_2: 'Support for additional species may be added in future updates.',

    // Environmental Factors
    faq_q_nighttime: 'Does the app account for nighttime or low-light conditions?',
    faq_a_nighttime_1: 'Scanning is recommended during daylight hours for accuracy.',

    // Data & History
    faq_q_history: 'How long is my harvest history stored in the app?',
    faq_a_history_1: 'Harvest records are stored indefinitely while your account is active.',
    faq_a_history_2: 'Local cache is retained on your device for offline access.',
    faq_a_history_3: 'Deleting the app will remove local data; cloud data remains intact.',

    // Account & Support
    faq_q_password: 'How do I reset my password?',
    faq_a_password_1: "Go to the settings screen and tap 'Change Password'.",

    faq_q_forum: 'Is there a community forum for local fish processors?',
    faq_a_forum_1: "There's no dedicated forum within the app yet.",
}

export const helpcenter = {
  help_title: 'Help Center',
  help_subtitle: 'FiScan — User guide & reference',

  help_overview_label: 'Overview',
  help_overview_body: 'This guide walks you through account setup, app navigation, drying area roles, and the image scan feature for quality assessment of sun-dried fish.',

  // Getting Started
  help_gs_label: 'Getting Started',
  help_gs_1_heading: '1. Create an account',
  help_gs_1_body: 'Open the app and tap Register. Enter your username, email, and create a password, then follow the complete profile steps. A success message will appear once registration is complete.',
  help_gs_2_heading: '2. Log in to your account',
  help_gs_2_body: 'Tap Log In, enter your registered email and password, then press Login. You\'ll see a confirmation message when login is successful before being redirected to complete your profile.',
  help_gs_3_heading: '3. Complete your profile',
  help_gs_3_body: 'After your first login, you\'ll be directed to the Complete Profile page. Fill in all required information including your full name, birthdate, mobile number, and other farmer details. Once completed, you\'ll be redirected to the dashboard.',

  // Navigating the App
  help_nav_label: 'Navigating the App',
  help_nav_1_heading: '1. Dashboard',
  help_nav_1_body: 'Your main hub displays a personalized welcome message, today\'s weather forecast, and drying recommendations. View weather charts and receive warnings about whether conditions are suitable for sun-drying your tuyo.',
  help_nav_weather_icons_label: 'Weather Icons Guide',
  help_nav_weather_icons_body: 'The app uses weather icons to help you quickly assess current conditions and determine whether sun-drying is safe.',

  // Weather icons
  help_weather_clear_label: 'Clear Sky',
  help_weather_clear_desc: 'Ideal drying conditions with strong sunlight.',
  help_weather_few_label: 'Few Clouds',
  help_weather_few_desc: 'Mostly sunny. Drying is still recommended.',
  help_weather_scattered_label: 'Scattered Clouds',
  help_weather_scattered_desc: 'Partial coverage. Drying may take longer.',
  help_weather_broken_label: 'Broken Clouds',
  help_weather_broken_desc: 'Limited sunlight. Drying efficiency reduced.',
  help_weather_shower_label: 'Shower Rain',
  help_weather_shower_desc: 'Light rain. Sun-drying not recommended.',
  help_weather_rain_label: 'Rain',
  help_weather_rain_desc: 'Continuous rainfall. Drying is unsafe.',
  help_weather_thunder_label: 'Thunderstorm',
  help_weather_thunder_desc: 'Severe weather. Drying should be avoided.',

  // Alert table
  help_alert_table_label: 'Weather Alerts for Drying Fish',
  help_alert_table_body: 'Alerts are calculated from rain probability and cloud coverage to indicate the risk of outdoor drying.',
  help_alert_col_rain: 'Rain %',
  help_alert_col_cloud: 'Cloud %',
  help_alert_col_alert: 'Alert',
  help_alert_excellent: 'Excellent',
  help_alert_good: 'Good',
  help_alert_caution: 'Caution',
  help_alert_warning: 'Warning',
  help_alert_danger: 'Danger',

  help_nav_2_heading: '2. Drying',
  help_nav_2_body: 'Monitor and track your sun-dried fish drying process. View ongoing batches and drying progress. Create your own drying area to start a batch, or join existing areas to collaborate with other users. The module provides step-by-step guidance and real-time progress tracking.',
  help_nav_3_heading: '3. Scan',
  help_nav_3_body: 'Capture images of your tuyo to analyze quality and get instant assessment results. Choose between your phone camera or gallery, then tap Scan to begin analysis. Results detect whether the tuyo is undried, dry, or rejected.',
  help_nav_4_heading: '4. Notifications',
  help_nav_4_body: 'Stay updated with alerts and reminders about your drying batches. The app sends weather notifications up to two days in advance, timed to your scheduled drying activities. You\'ll also receive drying progress updates and important announcements.',
  help_nav_5_heading: '5. Settings',
  help_nav_5_body: 'Manage your profile, change your password, and access the FAQ, Help Center, Terms of Service, and About pages. You can also securely log out from here.',

  // Drying Area Roles
  help_roles_label: 'Drying Area Roles & Permissions',
  help_roles_body: 'After joining or creating a drying area, users are assigned roles that determine what actions they can perform.',
  help_roles_admin_role: 'Admin',
  help_roles_admin_subtitle: 'Drying Area Owner',
  help_roles_admin_desc: 'Users who create a drying area automatically become the admin with full control. Admins can edit area info, create and delete trays, manage drying timelines, harvest batches, and delete the entire drying area.',
  help_roles_member_role: 'Member',
  help_roles_member_subtitle: 'Limited Access',
  help_roles_member_desc: 'Members can only use trays created by the admin. They can create drying timelines, monitor progress, and harvest their assigned batches. This ensures organized workflows and smooth collaboration.',

  // Scan Methods
  help_scan_label: 'Scan Methods & Guidelines',
  help_scan_body_1: 'The Scan feature analyzes dried fish quality using image recognition. Access it from the main hub or from inside a tray. After taking or selecting a photo, tap Scan to begin.',
  help_scan_body_2: 'For accurate results, lay the fish flat (not tilted), with the camera no more than 30 cm away to properly capture texture details.',
  help_scan_correct: 'Correct',
  help_scan_incorrect: 'Incorrect',
  help_scan_lawlaw_note: 'This feature is designed specifically for lawlaw fish. Scanning other fish types may produce inaccurate results.',
  help_scan_class_label: 'Classification Results',
  help_scan_class_body: 'Each scan result is color-coded for quick identification of dryness level and quality.',
  help_scan_status_reject: 'Reject',
  help_scan_status_reject_desc: 'Not suitable due to spoilage or defects.',
  help_scan_status_undried: 'Undried',
  help_scan_status_undried_desc: 'Still moist and needs more drying time.',
  help_scan_status_dry: 'Dry',
  help_scan_status_dry_desc: 'Fully dried and ready for storage or sale.',
  help_scan_class_col_status: 'Status',
  help_scan_class_col_desc: 'Description',

  // Need more help
  help_more_label: 'Need more help?',
  help_more_body: 'Explore the FAQ, review the Terms of Service, or visit the About section for more information. For issues not covered here, contact the developer through the About section.',
}

export const terms_en = {
  terms_title: 'Terms of Service',
  terms_last_updated: 'Last updated — April 01, 2026',
  terms_summary_label: 'Summary',
  terms_summary_body: 'This app assists tuyo farmers in Naic, Cavite with image processing and quality assessment of sun-dried fish. By using this app, you agree to provide accurate information and use the service for its intended agricultural purposes.',

  terms_1_title: '1. Acceptance of Terms',
  terms_1_body: 'By creating an account, you agree to comply with these Terms. If you do not agree, please do not use the application.',
  terms_2_title: '2. User Registration',
  terms_2_body: 'You must register with accurate personal information. You must be a tuyo farmer from Naic, Cavite.',
  terms_3_title: '3. Data Collection',
  terms_3_body: 'We collect basic account information used solely to provide our services. Your data will not be shared with third parties without consent, except as required by law.',
  terms_4_title: '4. Image Processing',
  terms_4_body: 'Results from image analysis are guides only. We do not guarantee 100% accuracy and recommend using results alongside traditional assessment methods.',
  terms_5_title: '5. User Responsibilities',
  terms_5_body: 'Use this app only for lawful purposes. Provide clear, accurate images. Misuse may result in account suspension.',
  terms_6_title: '6. Research & Academic Use',
  terms_6_body: 'This app is part of a thesis project. Anonymized data may be used for academic research. Personal information will remain confidential.',
  terms_7_title: '7. Limitation of Liability',
  terms_7_body: 'This app is provided "as is" for educational purposes. We are not liable for losses arising from use or reliance on its results.',
  terms_8_title: '8. Modifications',
  terms_8_body: 'We may modify or discontinue the service at any time. Continued use after changes constitutes acceptance of new terms.',
  terms_9_title: '9. Account Termination',
  terms_9_body: 'You may terminate your account anytime. We may suspend accounts that violate these terms. Some data may be retained for record-keeping.',
  terms_10_title: '10. Contact',
  terms_10_body: 'For questions or support, contact us through the Help Center within the application.',
  terms_11_title: '11. Governing Law',
  terms_11_body: 'These terms are governed by the laws of the Republic of the Philippines.',
}

export const settings_en = {
  settings_title: 'Settings',
  settings_edit: 'Edit',
  settings_group_account: 'Account',
  settings_group_support: 'Support',
  settings_group_legal: 'Legal',
  settings_group_preferences: 'Preferences',
  settings_menu_profile: 'User Profile',
  settings_menu_change_password: 'Change Password',
  settings_menu_faq: 'FAQ',
  settings_menu_help: 'Help Center',
  settings_menu_terms: 'Terms of Service',
  settings_menu_about: 'About',
  settings_language_label: 'Language',
  settings_language_value_en: 'English',
  settings_language_value_fil: 'Filipino',
  settings_logout: 'Logout',
}