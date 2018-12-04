angular.module('bhima.controllers')
  .controller('VillageController', VillageController);

VillageController.$inject = [
  'LocationService', 'util', 'NotifyService',
];

function VillageController(locationService, util, Notify) {
  const vm = this;
  vm.session = {};
  vm.view = 'default';
  vm.state = {};

  // bind methods
  vm.create = create;
  vm.submit = submit;
  vm.update = update;
  vm.cancel = cancel;

  vm.loadProvinces = loadProvinces;
  vm.loadSectors = loadSectors;
  vm.maxLength = util.maxTextLength;

  // fired on startup
  function startup() {
    // start up loading indicator
    vm.session.loading = true;

    // load Villages
    refreshVillages();
  }

  function cancel() {
    vm.view = 'default';
  }

  function create() {
    vm.view = 'create';
    vm.village = {};
  }

  vm.messages = {
    country : locationService.messages.country,
    province : locationService.messages.province,
    sector : locationService.messages.sector,
  };

  /** load countries on startup */
  locationService.countries()
    .then((countries) => {

      // bind the countries to the view for <select>ion
      vm.countries = countries;

      // make sure that we are showing the proper message to the client
      vm.messages.country = (countries.length > 0)
        ? locationService.messages.country
        : locationService.messages.empty;
    });

  /** loads provinces based on the selected country */
  function loadProvinces() {

    // make sure we do not make unnecessary HTTP requests
    if (!vm.village.country_uuid) { return; }

    locationService.provinces({ country : vm.village.country_uuid })
      .then((provinces) => {

        // bind the provinces to the view for <select>ion
        vm.provinces = provinces;

        // make sure that we show the correct message in the <select> option
        vm.messages.province = (provinces.length > 0)
          ? locationService.messages.province
          : locationService.messages.empty;
      });
  }

  /** loads sectors based on the selected province */
  function loadSectors() {

    // make sure we do not make unnecessary HTTP requests
    if (!vm.village.province_uuid) { return; }

    locationService.sectors({ province : vm.village.province_uuid })
      .then((sectors) => {

        // bind the sectors to the view for <select>ion
        vm.sectors = sectors;

        // make sure that we show the correct message in the <select> option
        vm.messages.sector = (sectors.length > 0)
          ? locationService.messages.sector
          : locationService.messages.empty;
      });
  }

  // switch to update mode
  // data is an object that contains all the information of a village
  function update(data) {
    vm.view = 'update';
    vm.village = data;
    vm.village.name = data.village;
    vm.village.uuid = data.villageUuid;
    vm.village.sector_uuid = data.sectorUuid;
    vm.village.province_uuid = data.provinceUuid;
    vm.village.country_uuid = data.countryUuid;
    vm.village.longitude = data.longitude;
    vm.village.latitude = data.latitude;
    loadProvinces();
    loadSectors();
  }


  // refresh the displayed Villages
  function refreshVillages() {
    return locationService.locations().then((data) => {
      vm.locations = data;
      vm.session.loading = false;
    });
  }

  // form submission
  function submit(form) {
    // stop submission if the form is invalid
    if (form.$invalid) {
      vm.state.errored = true;
      return 0;
    }

    const creation = (vm.view === 'create');
    const village = angular.copy(vm.village);

    const promise = (creation)
      ? locationService.create.village(village)
      : locationService.update.village(village.uuid, village);

    return promise
      .then(() => refreshVillages())
      .then(() => {
        vm.view = creation ? 'create_success' : 'update_success';
      })
      .catch(Notify.handleError);
  }

  startup();
}
