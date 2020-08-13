import Partner from "./Partner";
import {getPartnersWithinDistanceAndSortByName, loadPartners, setupPartners} from "./lib";

loadPartners()
    .then(setupPartners)
    .then((partners: Partner[]) => {
        return getPartnersWithinDistanceAndSortByName(partners, 75000);
    })
    .then((partners: Partner[]) => {
        console.log(partners);
    })
    .catch((e: Error) => {
        console.error('An error occured somewhere:', e);
    })

