import Footer from "./ecom/components/footer";
import HomeCarousel from "./ecom/components/HomeCarousel";
import CircularCat from "./ecom/components/circle_cat";
import { redirect } from 'next/navigation';

export default function HomeRedirect() {
  // Redirects the root path (/) to the desired e-commerce products page.
  // The destination path should be the external URL path, which is /products.
  redirect('/menu01');
}
// export default function Home() {
//   return (
//     <div>
//       redirect('/ecom/products');

      {/* <HomeCarousel /> */}

      {/* <div className="flex flex-col justify-center items-center">
        <p className="text-[28px] font-bold mb-5">Shop By Category</p>
        <div className="flex space-x-10 mb-10">
          <CircularCat
            imgUrl={"/assets/cosm/rice-scrub-01.jpg"}
            text={"Face Care"}
          />
          <CircularCat
            imgUrl={"/assets/cosm/herbal-hair-oil-01.jpg"}
            text={"Hair Oil"}
          />
          <CircularCat
            imgUrl={"/assets/cosm/kera-flax-shampoo-01.jpg"}
            text={"Hair Care"}
          />
        </div>
      </div> */}

//       <Footer />
//     </div>
//   );
// }
