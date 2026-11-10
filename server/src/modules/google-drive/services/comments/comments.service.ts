import { Injectable } from '@nestjs/common';
import { GoogleDriveClientService } from '../google-drive-client.service.js';
import {
  driveCommentFields,
  driveCommentListFields,
} from '../google-drive-fields.js';

// Creates, retrieves, updates, lists, and deletes comments on Drive files.
@Injectable()
export class CommentsService {
  constructor(
    private readonly googleDriveClientService: GoogleDriveClientService,
  ) {}

  // Creates a comment on a Drive file.
  async createComment(
    userId: string,
    input: {
      fileId: string;
      content: string;
      quotedFileContent?: { mimeType: string; value: string };
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.comments.create({
      fileId: input.fileId,
      requestBody: {
        content: input.content,
        quotedFileContent: input.quotedFileContent,
      },
      fields: driveCommentFields(
        'id',
        'content',
        'author',
        'createdTime',
        'modifiedTime',
        'quotedFileContent',
        'resolved',
        'replies',
      ),
    });

    return response.data;
  }

  // Retrieves a comment by its ID.
  async getComment(
    userId: string,
    input: {
      fileId: string;
      commentId: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.comments.get({
      fileId: input.fileId,
      commentId: input.commentId,
      fields: driveCommentFields(
        'id',
        'content',
        'author',
        'createdTime',
        'modifiedTime',
        'quotedFileContent',
        'resolved',
        'deleted',
        'replies',
      ),
    });

    return response.data;
  }

  // Lists comments attached to a Drive file.
  async listComments(
    userId: string,
    input: {
      fileId: string;
      pageToken?: string;
      includeDeleted?: boolean;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.comments.list({
      fileId: input.fileId,
      pageSize: 100,
      pageToken: input.pageToken,
      includeDeleted: input.includeDeleted,
      fields: `${driveCommentListFields('nextPageToken', 'comments')}, comments(${driveCommentFields(
        'id',
        'content',
        'author',
        'createdTime',
        'modifiedTime',
        'quotedFileContent',
        'resolved',
        'deleted',
        'replies',
      )})`,
    });

    return {
      comments: response.data.comments ?? [],
      nextPageToken: response.data.nextPageToken ?? null,
    };
  }

  // Updates comment content or its resolved state.
  async updateComment(
    userId: string,
    input: {
      fileId: string;
      commentId: string;
      content?: string;
      resolved?: boolean;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.comments.update({
      fileId: input.fileId,
      commentId: input.commentId,
      requestBody: {
        content: input.content,
        resolved: input.resolved,
      },
      fields: driveCommentFields(
        'id',
        'content',
        'author',
        'createdTime',
        'modifiedTime',
        'resolved',
        'deleted',
        'replies',
      ),
    });

    return response.data;
  }

  // Deletes a comment from a Drive file.
  async deleteComment(
    userId: string,
    input: {
      fileId: string;
      commentId: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    await drive.comments.delete({
      fileId: input.fileId,
      commentId: input.commentId,
    });

    return { fileId: input.fileId, commentId: input.commentId };
  }
}
