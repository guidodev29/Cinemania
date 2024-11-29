import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {SeatsService} from "../../../core/services/admin/seats.service";

@Component({
  selector: 'app-home',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit  {
  constructor(
    private router: Router,
    private seat: SeatsService,
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
