<?php
/**
 * Upload Helper Functions
 */

class Upload {
    /**
     * Handle file upload
     * @param array $file $_FILES array element
     * @param string $folder Subfolder in uploads directory
     * @return string|null URL of uploaded file or null
     */
    public static function handleImage($file, $folder) {
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return null;
        }
        
        // Validate file type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, ALLOWED_IMAGE_TYPES)) {
            throw new Exception('Sadece resim dosyaları yüklenebilir (jpeg, jpg, png, webp, gif)');
        }
        
        // Validate file size
        if ($file['size'] > MAX_FILE_SIZE) {
            throw new Exception('Dosya boyutu 5MB\'dan büyük olamaz');
        }
        
        // Generate unique filename
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = time() . '-' . bin2hex(random_bytes(4)) . '.' . strtolower($ext);
        
        // Create target path
        $targetDir = UPLOAD_DIR . '/' . $folder;
        $targetPath = $targetDir . '/' . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new Exception('Dosya yüklenemedi');
        }
        
        // Return public URL
        return UPLOAD_BASE_URL . '/' . $folder . '/' . $filename;
    }
    
    /**
     * Delete a file from uploads
     * @param string $url The public URL of the file
     */
    public static function delete($url) {
        if (empty($url)) {
            return;
        }
        
        // Extract filename from URL
        $baseUrl = UPLOAD_BASE_URL;
        if (strpos($url, $baseUrl) === 0) {
            $relativePath = substr($url, strlen($baseUrl));
            $filePath = UPLOAD_DIR . $relativePath;
            
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
    }
}
