<? php 

// Connection: hostname, db_user, db_password, db_name
define("db_host", "localhost");

// Database User
define("db_user", "root");

// Database Password
define("db_password", "");

// Database Name
define("db_name", "live_chat_support");

// Database Charset
define("db_charset", "utf-8");

// Authentication for guests
define("authentication_required", "false");

// Number of Messages
define("max_messages", 25);

// Emoji List
define("emoji_list", "1F600", "1F601", "1F602", "1F603", "1F604", "1F605", "!F606");

// Attachments
define("attachments_enabled", true);

// Upload Directory
define("file_upload_directory", "attachments/");

// Maximum Allowed Upload File Size (500 kg)
define("max_allowed_upload_file_size", "512000");

// File Extension
define("file_types_allowed", ".png, .jpg, .jpeg, .webp, .gif, .bmp");

// Measured In Miliseconds
define("conversation_refresh_rate", "5000");
define("requests_refresh_rate", "10000");
define("users_online_refresh_rate", "10000");
define("general_info_refresh_rate", "10000");

?>