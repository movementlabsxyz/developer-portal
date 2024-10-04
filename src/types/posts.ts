// types/posts.ts

export interface PostData {
    id: string;
    title: string;
    date: string;
    categories: string[];
    contentHtml?: string;
    filePath: string;
    [key: string]: any; // For additional front matter properties
  }
  
  export interface DirectoryNode {
    name: string;
    path: string;
    type: 'directory';
    children: PostNode[];
  }
  
  export interface FileNode {
    name: string;
    path: string;
    type: 'file';
    postData: PostData;
  }
  
  export type PostNode = DirectoryNode | FileNode;