import {fetchWorks, displayFilters} from './js/api.js';
import {setupLogin} from './js/authentification.js';
import {setupModal, fetchWorksModal, addWork, fetchCategories} from './js/modal.js';

console.log("Js bien importé");

setupLogin();

setupModal();
fetchWorksModal();
fetchCategories();
addWork();

displayFilters();
setupFilters();
fetchWorks();
