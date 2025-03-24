import { defineStore } from 'pinia';

import { IStaffStateStore } from '../interfaces';

export const useStaffStore = defineStore('staff', {
  state: (): IStaffStateStore => ({
    employees: [
      {
        employeeId: 1,
        name: 'Bessie Cooper',
        email: 'bcopper@mail.com',
        phoneNumber: '0876-5432-1098',
        title: 'Owner',
        userPermission: 'Owner',
      },
      {
        employeeId: 2,
        name: 'Esther Howard',
        email: 'ehoward@mail.com',
        phoneNumber: '0856-7890-4321',
        title: 'Co owner',
        userPermission: 'Manager',
      },
      {
        employeeId: 3,
        name: 'Brooklyn Simmons',
        email: 'bsimmons@mail.com',
        phoneNumber: '0812-3456-7890',
        title: 'Store Manager',
        userPermission: 'Supervisor',
      },
      {
        employeeId: 4,
        name: 'Cameron Williamson',
        email: 'cwilliamsin@mail.com',
        phoneNumber: '0834-5678-1234',
        title: 'Store Manager',
        userPermission: 'Senior',
      },
      {
        employeeId: 5,
        name: 'Leslie Alexander',
        email: 'lalexander@mail.com',
        phoneNumber: '0833-2468-1357',
        title: 'Store Manager',
        userPermission: 'Senior',
      },
      {
        employeeId: 6,
        name: 'Guy Hawkins',
        email: 'ghawkins@mail.com',
        phoneNumber: '0896-1092-8473',
        title: 'Inventory Manager',
        userPermission: 'Junior',
      },
      {
        employeeId: 7,
        name: 'Floyd Miles',
        email: 'fmiles@mail.com',
        phoneNumber: '0852-8023-5432',
        title: 'Inventory Manager',
        userPermission: 'Basic',
      },
      {
        employeeId: 8,
        name: 'Marvin McKinney',
        email: 'mmckinney@mail.com',
        phoneNumber: '0821-0987-6543',
        title: 'Cashier',
        userPermission: 'Basic',
      },
      {
        employeeId: 9,
        name: 'Robert Fox',
        email: 'rfox@mail.com',
        phoneNumber: '0822-4903-1765',
        title: 'Cashier',
        userPermission: 'No access',
      },
      {
        employeeId: 10,
        name: 'Jacob Jones',
        email: 'jjones@mail.com',
        phoneNumber: '0876-5432-1098',
        title: 'Cashier',
        userPermission: 'No access',
      },
    ],
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'employeeId' as keyof IStaffStateStore['employees'][number],
    sortOrder: 'asc' as 'asc' | 'desc',
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
    sortedEmployees(state): IStaffStateStore['employees'] {
      const sorted = [...state.employees].sort((a, b) => {
        const field = state.sortField as keyof IStaffStateStore['employees'][number];
        if (a[field] < b[field]) return state.sortOrder === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return state.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      return sorted;
    },
    paginatedEmployees(state): IStaffStateStore['employees'] {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return this.sortedEmployees.slice(start, end);
    },
    totalPages(state): number {
      return Math.ceil(state.employees.length / state.itemsPerPage);
    },
  },
  actions: {
    /**
     * @description Handle fetch api cashier search.
     * @url /cashier/search
     * @method GET
     * @access public
     */
    async staff_fetchSearch(searchData: string): Promise<void> {
      // TODO: Fetch API when the endpoint is ready
      console.log(searchData);
    },
    async staff_fetchFilter(filterTitleData: string, filterPermissionData: string): Promise<void> {
      // TODO: Fetch API when the endpoint is ready
      console.log(filterTitleData, filterPermissionData);
    },
    setSortField(field: keyof IStaffStateStore['employees'][number]) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortOrder = 'asc';
      }
    },
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
});
