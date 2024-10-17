export interface ITestimonial {
  testimonial: string;
  testifier: {
    name: string;
    roleDescription: string;
    image: string;
    business: {
      name: string;
      logo: string;
    };
  };
}

export interface ITestimonialContentTypeResponse {
  metadata: Metadata;
  sys: Sys2;
  fields: TestimonialFields;
}

interface TestimonialFields {
  businessName: string;
  businessLogo: Image;
  testifierName: string;
  testifierImage: Image;
  testifierDescription: string;
  testimonial: string;
}

interface Image {
  metadata: Metadata;
  sys: Sys3;
  fields: ImageField;
}

interface ImageField {
  title: string;
  description: string;
  file: File;
}

interface File {
  url: string;
  details: FileDetails;
  fileName: string;
  contentType: string;
}

interface FileDetails {
  size: number;
  image: ImageSize;
}

interface ImageSize {
  width: number;
  height: number;
}

interface Sys3 {
  space: Space;
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: Space;
  revision: number;
  locale: string;
}

interface Sys2 {
  space: Space;
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: Space;
  revision: number;
  contentType: Space;
  locale: string;
}

interface Space {
  sys: Sys;
}

interface Sys {
  type: string;
  linkType: string;
  id: string;
}

interface Metadata {
  tags: unknown[];
}
