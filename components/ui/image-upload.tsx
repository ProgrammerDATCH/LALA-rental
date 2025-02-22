import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, ImageIcon, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ImageUploadProps {
    name: string;
    label: string;
    currentImage: string | null | undefined;
    onImageChange: (name: string, url: string) => void;
    isRequired: boolean;
    classNames?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name, label, currentImage, onImageChange, isRequired, classNames }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const simulateProgress = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 5;
            });
        }, 100);
        return interval;
    };

    const handleImageUpload = async (file: File) => {
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setIsUploading(true);
            setImageError(false);
            const progressInterval = simulateProgress();

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'datch-upload-preset');

            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/dlhivvi0h/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Upload failed');
                setUploadProgress(100);
                onImageChange(name, data.secure_url);
                // toast.success('Image uploaded successfully');
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Failed to upload image. Please try again.');
            } finally {
                clearInterval(progressInterval);
                setTimeout(() => {
                    setIsUploading(false);
                    setUploadProgress(0);
                }, 500);
            }
        }
    };

    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) handleImageUpload(file);
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget === dropZoneRef.current) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) handleImageUpload(file);
    };

    const openFileOrCamera = () => {
        if (fileInputRef.current) {
            if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
                fileInputRef.current.capture = 'environment';
            }
            fileInputRef.current.click();
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {isRequired && <span className="text-destructive ml-1">*</span>}
            </label>

            <div
                ref={dropZoneRef}
                onClick={!currentImage ? openFileOrCamera : undefined}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative w-40 h-40 rounded-lg overflow-hidden transition-all duration-300",
                    isDragging && "ring-2 ring-primary ring-offset-2 scale-105",
                    isRequired && !currentImage ? "border-2 border-destructive" : "border-2 border-input",
                    !currentImage && "cursor-pointer hover:border-primary",
                    "group",
                    classNames
                )}
            >
                {/* Drag overlay */}
                {isDragging && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="text-center text-primary">
                            <Upload className="h-10 w-10 mx-auto mb-2" />
                            <p className="text-sm">Drop image here</p>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!currentImage && !isUploading && !isDragging && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 gap-2">
                        <div className="p-2 rounded-full bg-muted">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground text-center px-2">
                            Click or drag image here
                        </p>
                    </div>
                )}

                {/* Current image or uploading state */}
                {(currentImage || isUploading) && (
                    <>
                        {isUploading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                                <Upload className="h-10 w-10 text-primary animate-bounce mb-2" />
                                <Progress value={uploadProgress} className="w-full" />
                            </div>
                        ) : (
                            <img
                                src={currentImage!}
                                alt={label}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        )}

                        {/* Image controls */}
                        {currentImage && !isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50">
                                <div className="flex gap-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowPreview(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Preview image</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onImageChange(name, '');
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Remove image</TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    accept="image/*"
                    disabled={isUploading}
                />
            </div>

            {/* Validation message */}
            {isRequired && !currentImage && (
                <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                        This image is required
                    </AlertDescription>
                </Alert>
            )}

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{label}</DialogTitle>
                    </DialogHeader>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <img
                            src={currentImage || ''}
                            alt={label}
                            className="object-contain w-full h-full"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImageUpload;