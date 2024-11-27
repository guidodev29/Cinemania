import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {MovieService} from "../../../core/services/admin/movie.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-home',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit  {
  movies: any[] = [];
  constructor(
    private router: Router,
    private movieService: MovieService,
    private toastr: ToastrService
  ) {}

  logOut(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_Info');

    this.router.navigate(['/admin-home']);

  }

  ngOnInit(): void {
  }

}
