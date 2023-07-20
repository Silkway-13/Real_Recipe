
export default class Likes {
      constructor() {
            this.readDataLocalStorage();
            if(!this.likes) this.likes = [];
      }

      addLike(id, title, publisher, img){
            const like = {id, title, publisher, img};
            this.likes.push(like);

            // to save Storage
            this.saveDataToLocalStorage();
            return like;
      };

      deleteLike(id){
            const index = this.likes.findIndex(el => el.id === id);

            // to save Storage
            this.saveDataToLocalStorage();

            this.likes.splice(index, 1);
      };

      isLiked(id){
            // if(this.likes.findIndex(el => el.id === id) === -1 ) return false;
            // else return true;
            return this.likes.findIndex(el => el.id === id) !== -1
      };

      getNumberOfLikes() {
            return this.likes.length;
      };

      saveDataToLocalStorage() {
            localStorage.setItem("likes", JSON.stringify(this.likes));
      };

      readDataLocalStorage() {
            this.likes = JSON.parse(localStorage.getItem("likes"));
      };
}