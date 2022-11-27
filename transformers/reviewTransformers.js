const reviewTransformer = (review) => {
  delete review ["dataValues"]["createdAt"]
  delete review ["dataValues"]["updatedAt"]

    return review;
  };
var reviewsTransformer = function(reviews) {
  return reviews.map(review => reviewTransformer(review))
}

  
  module.exports = {
    reviewTransformer,
    reviewsTransformer
  }