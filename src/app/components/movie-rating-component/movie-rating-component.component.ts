import { Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { MovieActions } from '../../../store/movies/actions';

@Component({
  selector: 'app-movie-rating-component',
  templateUrl: './movie-rating-component.component.html',
  styleUrls: ['./movie-rating-component.component.scss']
})
export class MovieRatingComponentComponent {
  movie;
  constructor(
    navParams: NavParams,
    private movieActions: MovieActions,
    private popoverController: PopoverController
  ) {
    this.movie = navParams.get('message');
  }

  onRatingChange(event) {
    console.log(event);
    let type = this.movie.type;
    if (!type) {
      type = this.movie.release_date ? 'movie' : 'tv';
    }
    const update = {
      ...this.movie,
      rating: event
    };
    this.movieActions.updateMovie(update, type);
    this.movieActions.updateSearchMovie(update);
    this.popoverController.dismiss();
  }
}
