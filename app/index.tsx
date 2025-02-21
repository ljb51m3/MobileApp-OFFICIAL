/*

THIS IS THE FIRST SCREEN THAT WILL ALWAYS APPEAR.
The app automatically directs to the index.tsx file.


This code redirects the user to whichever page we specify is the first page (in this case, it is welcome.tsx)

Make sure 'expo-router' is downloaded.
*/

import { Redirect } from "expo-router";

export default function RedirectToAuth() {
  return <Redirect href="/welcome/welcome" />;
}
