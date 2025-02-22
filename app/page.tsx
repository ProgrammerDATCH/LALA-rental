import { Suspense } from "react"
import { PropertiesList } from "@/components/properties/properties-list"
import { Loading } from "@/components/ui/loading"
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to LaLa Rentals</h1>
      <p className="text-lg text-muted-foreground mt-2">
        Find and book your perfect rental property
      </p>
      <div className="mt-8">
        <Suspense fallback={<Loading />}>
          <HeroSection />
          <Features />
          <FeaturedProperties />
        </Suspense>
      </div>
    </div>
  )
}


const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

      <div className="relative mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Welcome to LaLa Rentals
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Find and book your perfect rental property. Experience comfort and luxury in every stay.
          </p>


        </div>
      </div>
    </div>
  );
};

const FeaturedProperties = () => {
  return (
    <div className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Latest Properties
        </h2>
        <Suspense fallback={<Loading />}>
          <PropertiesList />
        </Suspense>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      title: "Verified Properties",
      description: "All properties are carefully verified for quality and safety"
    },
    {
      title: "Instant Booking",
      description: "Book your stay with just a few clicks"
    },
    {
      title: "24/7 Support",
      description: "Our team is always here to help you"
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Why Choose LaLa Rentals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};