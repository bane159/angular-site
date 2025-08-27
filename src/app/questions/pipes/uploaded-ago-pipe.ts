import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uploadedAgo'
})
export class UploadedAgoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'string') {
      const date = new Date(value);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      } else {
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
      }
    }
    return null;
  }

}
