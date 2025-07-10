/**
 * @fileoverview Image optimization utilities
 * Handles image compression, resizing, and format conversion
 */

import { UploadError } from './errorHandler.js';

/**
 * Image optimization utility
 */
export class ImageOptimizer {
    /**
     * Default optimization options
     */
    static DEFAULT_OPTIONS = {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        format: 'jpeg'
    };

    /**
     * Optimize an image file
     * @param {File} file - The image file to optimize
     * @param {Object} options - Optimization options
     * @returns {Promise<File>} Optimized image file
     * @throws {UploadError} If optimization fails
     */
    static async optimizeImage(file, options = {}) {
        // Merge options with defaults
        const settings = {
            ...this.DEFAULT_OPTIONS,
            ...options
        };

        try {
            // Validate file
            if (!file || !(file instanceof File)) {
                throw new UploadError('Invalid file provided');
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                throw new UploadError('File is not an image', file);
            }

            // Create image object
            const img = await this.createImage(file);

            // Calculate dimensions
            const dimensions = this.calculateDimensions(
                img.width,
                img.height,
                settings.maxWidth,
                settings.maxHeight
            );

            // Create canvas and compress
            const canvas = document.createElement('canvas');
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

            // Convert to blob
            const blob = await this.canvasToBlob(canvas, settings.format, settings.quality);

            // Create new file
            return new File(
                [blob],
                this.generateOptimizedFileName(file.name, settings.format),
                { type: `image/${settings.format}` }
            );
        } catch (error) {
            if (error instanceof UploadError) {
                throw error;
            }
            throw new UploadError('Image optimization failed', file);
        }
    }

    /**
     * Create an image object from a file
     * @private
     */
    static createImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new UploadError('Failed to load image', file));
            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * Calculate new dimensions maintaining aspect ratio
     * @private
     */
    static calculateDimensions(width, height, maxWidth, maxHeight) {
        let newWidth = width;
        let newHeight = height;

        if (width > maxWidth) {
            newWidth = maxWidth;
            newHeight = (height * maxWidth) / width;
        }

        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = (width * maxHeight) / height;
        }

        return {
            width: Math.round(newWidth),
            height: Math.round(newHeight)
        };
    }

    /**
     * Convert canvas to blob
     * @private
     */
    static canvasToBlob(canvas, format, quality) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas to Blob conversion failed'));
                    }
                },
                `image/${format}`,
                quality
            );
        });
    }

    /**
     * Generate optimized file name
     * @private
     */
    static generateOptimizedFileName(originalName, format) {
        const timestamp = new Date().getTime();
        const baseName = originalName.replace(/\.[^/.]+$/, ''); // Remove extension
        return `${baseName}_optimized_${timestamp}.${format}`;
    }

    /**
     * Check if file needs optimization
     * @param {File} file - The file to check
     * @param {Object} options - Optimization options
     * @returns {Promise<boolean>} Whether the file needs optimization
     */
    static async needsOptimization(file, options = {}) {
        const settings = {
            ...this.DEFAULT_OPTIONS,
            ...options
        };

        try {
            const img = await this.createImage(file);
            
            return (
                img.width > settings.maxWidth ||
                img.height > settings.maxHeight ||
                file.size > 1024 * 1024 // 1MB
            );
        } catch (error) {
            return true; // If we can't check, better optimize
        }
    }

    /**
     * Get file size in human readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }
} 