import { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Placeholder Key West images from Unsplash
const photos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1580904083555-ac5c2dab4330?w=800',
    caption: 'Key West Sunset',
    credit: 'Unsplash',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1548515154-1a847dd63be0?w=800',
    caption: 'Tropical Waters',
    credit: 'Unsplash',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    caption: 'Beach Paradise',
    credit: 'Unsplash',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    caption: 'Crystal Clear Beach',
    credit: 'Unsplash',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800',
    caption: 'Palm Trees',
    credit: 'Unsplash',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
    caption: 'Ocean View',
    credit: 'Unsplash',
  },
];

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const openLightbox = (index) => setSelectedPhoto(index);
  const closeLightbox = () => setSelectedPhoto(null);

  const goToPrev = () => {
    setSelectedPhoto((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedPhoto((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-2">
            <Camera className="text-white" />
            Photo Gallery
          </h2>
          <p className="text-white/80 mt-2">
            Key West vibes (replace with your own trip photos!)
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden rounded-xl group"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium">{photo.caption}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Upload Hint */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm">
            <Camera size={16} />
            <span>Add your own photos by replacing the images in the code!</span>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
          >
            <X size={32} />
          </button>

          {/* Prev button */}
          <button
            onClick={goToPrev}
            className="absolute left-4 text-white/80 hover:text-white p-2"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Image */}
          <div className="max-w-4xl max-h-[80vh] px-16">
            <img
              src={photos[selectedPhoto].url}
              alt={photos[selectedPhoto].caption}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4">
              {photos[selectedPhoto].caption}
            </p>
          </div>

          {/* Next button */}
          <button
            onClick={goToNext}
            className="absolute right-4 text-white/80 hover:text-white p-2"
          >
            <ChevronRight size={40} />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhoto(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedPhoto ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
