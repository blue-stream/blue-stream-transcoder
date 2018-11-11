export interface IUploadedVideo {
    id: string;
    key: string;
}

export interface ITranscodedVideo {
    id: string;
    thumbnailPath: string;
    previewPath: string;
    videoPath: string
}
