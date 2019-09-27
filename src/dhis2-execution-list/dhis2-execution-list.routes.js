/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    angular
        .module('dhis2-execution-list')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider.state('openlmis.administration.dhis2.executions', {
            label: 'dhis2.executions',
            url: '/executions?page&size&sort',
            controller: 'ExecutionListController',
            templateUrl: 'dhis2-execution-list/dhis2-execution-list.html',
            controllerAs: 'vm',
            resolve: {
                executions: function(paginationService, ExecutionResource, $stateParams) {
                    return paginationService.registerUrl($stateParams, function(stateParams) {
                        if (!stateParams.sort) {
                            stateParams.sort = 'startDate,desc';
                        }

                        return new ExecutionResource().query(stateParams);
                    });
                },
                periods: function(executions, ProcessingPeriodResource) {
                    if (!executions || executions.length === 0) {
                        return [];
                    }

                    var periodIds = executions
                        .map(function(execution) {
                            return execution.processingPeriodId;
                        });

                    return new ProcessingPeriodResource()
                        .query({
                            id: periodIds
                        })
                        .then(function(page) {
                            return page.content;
                        });
                },
                periodsMap: function(periods) {
                    return periods.reduce(function(periodsMap, period) {
                        periodsMap[period.id] = period;
                        return periodsMap;
                    }, {});
                }
            }
        });
    }
})();