import { OrderList } from './orderList';
import { Observable } from 'rxjs/Observable';

import { BackendConfig, BackendType } from '../backend.module';
import { BookingInMemoryService } from './booking-in-memory.service';
import { BookingRestService } from './booking-rest.service';
import { OnInit, Injector, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IBookingDataService } from './booking-data-service-interface';
import { BookingInfo } from './bookingInfo';

@Injectable()
export class BookingDataService implements IBookingDataService {

    usedImplementation: IBookingDataService;

    constructor(private injector: Injector) {
        const backendConfig: BackendConfig = this.injector.get(BackendConfig);
        if (backendConfig.environmentType === BackendType.IN_MEMORY) {
            this.usedImplementation = new BookingInMemoryService();
        } else { // default
            this.usedImplementation = new BookingRestService(this.injector);
        }
    }

    getBookingId(): Observable<number> {
        return this.usedImplementation.getBookingId();
    }

    bookTable(booking: BookingInfo): Observable<number> {
        return this.usedImplementation.bookTable(booking);
    }

    getOrders(): Observable<BookingInfo[]> {
        return this.usedImplementation.getOrders();
    }

    getOrder(id: number): Observable<BookingInfo> {
        return this.usedImplementation.getOrder(id);
    }

    getReservations(): Observable<BookingInfo[]> {
        return this.usedImplementation.getReservations();
    }

    getReservation(id: number): Observable<BookingInfo> {
        return this.usedImplementation.getReservation(id);
    }

    saveOrders(orders: OrderList): Observable<number> {
        return this.usedImplementation.saveOrders(orders);
    }

}
