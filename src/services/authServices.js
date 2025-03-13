import { authAxios } from "./HttpMethod";
import { profileInfoURL, companyInfoURL, getProductCategoryListURL, } from "./ConstantServies";

export function getProfileInfo() {
    // console.log('getProfileInfo')
    return authAxios(profileInfoURL)
}

export function getCompanyInfo() {
    return authAxios(companyInfoURL)
}

export function getProductCategoryInfo() {
    return authAxios(getProductCategoryListURL)
}
