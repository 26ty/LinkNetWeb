import { TestBed } from '@angular/core/testing';

import { ImageFileServiceService } from './image-file-service.service';

describe('ImageFileServiceService', () => {
  let service: ImageFileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageFileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
