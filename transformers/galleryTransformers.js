const galleryTransformer = (gallery) => {
  gallery.file = `${process.env.API_URL + "/uploads/" + gallery.file}`;


  delete gallery ["dataValues"]["createdAt"]
  delete gallery ["dataValues"]["updatedAt"]
  
  return gallery;
};

const galleriesTransformer = (galleries) => {
  return galleries.map((gallery) => galleryTransformer(gallery));
};

module.exports = {
  galleryTransformer,
  galleriesTransformer,
};