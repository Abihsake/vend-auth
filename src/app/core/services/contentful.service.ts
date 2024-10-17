import { Injectable } from '@angular/core';
import { createClient } from 'contentful';
import { from, Observable } from 'rxjs';
import { ContentfulConfig } from '@core/enum/contentful';

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {
  private contentDeliveryClient = createClient({
    space: ContentfulConfig.SPACE_ID,
    accessToken: ContentfulConfig.ACCESS_TOKEN
  });

  getEntries<T>(contentType: string): Observable<T[]> {
    const query = {};
    return from(
      this.contentDeliveryClient.getEntries(Object.assign({ content_type: contentType }, query)).then((res) => {
        const toReturn = res.items;
        return toReturn as unknown as Array<T>;
      })
    );
  }

  getEntry<T>(id: string): Observable<T> {
    return from(
      this.contentDeliveryClient.getEntry(id).then((res) => {
        const toReturn = res.fields;
        return toReturn as unknown as T;
      })
    );
  }
}
