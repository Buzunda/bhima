angular.module('bhima.controllers')
  .controller('unbalanced_invoice_payments_reportController', UnbalancedInvoicePaymentsConfigController);

UnbalancedInvoicePaymentsConfigController.$inject = [
  '$sce', 'NotifyService', 'BaseReportService', 'AppCache', 'reportData',
  '$state', 'moment', 'bhConstants',
];

function UnbalancedInvoicePaymentsConfigController($sce,
  Notify, SavedReports, AppCache, reportData, $state, Moment, bhConstants) {
  const vm = this;
  const cache = new AppCache('configure_unbalanced_invoice_payments_report');
  const reportUrl = 'reports/finance/unbalanced_invoice_payments';

  vm.previewGenerated = false;
  vm.reportDetails = {};

  checkCachedConfiguration();


  vm.clearPreview = function clearPreview() {
    vm.previewGenerated = false;
    vm.previewResult = null;
  };

  vm.requestSaveAs = function requestSaveAs() {
    const options = {
      url : reportUrl,
      report : reportData,
      reportOptions : sanitiseDateStrings(vm.reportDetails),
    };

    return SavedReports.saveAsModal(options)
      .then(() => {
        $state.go('reportsBase.reportsArchive', { key : options.report.report_key });
      })
      .catch(Notify.handleError);
  };

  vm.preview = function preview(form) {
    if (form.$invalid) {
      return;
    }
    cache.reportDetails = angular.copy(vm.reportDetails);

    const sendDetails = sanitiseDateStrings(vm.reportDetails);
    vm.loading = true;
    SavedReports.requestPreview(reportUrl, reportData.id, sendDetails)
      .then((result) => {
        // update cached configuration
        vm.previewGenerated = true;
        vm.previewResult = $sce.trustAsHtml(result);
      })
      .catch(Notify.handleError)
      .finally(() => {
        vm.loading = false;
      });
  };

  function sanitiseDateStrings(options) {
    const sanitisedOptions = angular.copy(options);
    sanitisedOptions.dateTo = Moment(sanitisedOptions.dateTo).format(bhConstants.dates.formatDB);
    sanitisedOptions.dateFrom = Moment(sanitisedOptions.dateFrom).format(bhConstants.dates.formatDB);
    return sanitisedOptions;
  }

  function checkCachedConfiguration() {
    if (cache.reportDetails) {
      vm.reportDetails = angular.copy(cache.reportDetails);
    }
    // FIX ME : We don't need the ignored clients list from the cache
    vm.reportDetails.ignoredClients = [];
  }
}
