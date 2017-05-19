import { Component, OnInit, Inject } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn, TdDataTableService } from '@covalent/core';
import { ExtraView, OrderView, ReservationView } from '../../../shared/models/interfaces';
import { OrderCockpitService } from '../shared/order-cockpit.service';
import { PriceCalculatorService } from '../../../sidenav/shared/price-calculator.service';
import {MD_DIALOG_DATA} from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'cockpit-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss'],
})
export class OrderDialogComponent implements OnInit {

  columnst: ITdDataTableColumn[] = [
    { name: 'date', label: 'Reservation date'},
    { name: 'hour', label: 'Reservation hour'},
    { name: 'creationDate', label: 'Creation date'},
    { name: 'creationHour', label: 'Creation time'},
    { name: 'nameOwner', label: 'Owner' },
    { name: 'emailOwner', label: 'Email' },
    { name: 'bookingId', label: 'Table'},
  ];

  columnso: ITdDataTableColumn[] = [
    { name: 'name', label: 'Dish'},
    { name: 'comment', label: 'Comments'},
    { name: 'extras', label: 'Extra' },
    { name: 'amount', label: 'Quantity' },
    { name: 'price', label: 'Price'},
  ];

  bookingId: number;
  datao: OrderView[] = [];
  datat: ReservationView[] = [];

  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  filteredData: OrderView[] = this.datao;
  totalPrice: number;

  constructor(private _dataTableService: TdDataTableService,
              private priceCalculator: PriceCalculatorService,
              private orderCockpitService: OrderCockpitService,
              @Inject(MD_DIALOG_DATA) dialogData: any) {
                 this.bookingId = dialogData.row.bookingId;
  }

  ngOnInit(): void {
    this.orderCockpitService.getOrder(this.bookingId).subscribe( (order: ReservationView) => {
      this.datat.push(order);
      this.totalPrice = this.priceCalculator.getTotalPrice(order.orders);
      this.datao = JSON.parse(JSON.stringify(order.orders));
      _.map(this.datao, (o: OrderView) => {
        o.price = this.priceCalculator.getPrice(o);
        o.extras = _.reduce(o.extras, (result: string, opt: ExtraView) => {
          if (opt.selected) {
            return result + ' ' + opt.name + ',';
          } else {
            return result;
          }
        }, '').slice(0, -1);
      });
    });
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    let newData: any[] = this.datao;
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }
}
