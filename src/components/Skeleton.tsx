import Skeleton from "@mui/material/Skeleton";

export function NaveBarSkeleton() {
  return (
    <>
      <nav className="flex w-full px-[1rem] md:px-[3rem] py-3 justify-between items-center shadow-lg">
        {/* logo */}
        <Skeleton variant="circular" sx={{ width: "3rem", height: "3rem" }} />
        <div className=" hidden  md:block w-[30%]">
          <Skeleton variant="rounded" sx={{ width: "20rem", height: "2rem" }} />
        </div>
        <div className="hidden xl:flex w-[60%] items-center">
          <div className="items-center w-[80%] ">
            <Skeleton height={50} width={400} />
          </div>
          <div>
            <Skeleton height={40} width={300} />
          </div>
        </div>
      </nav>
    </>
  );
}
export function HeroSkeleton() {
  return (
    <>
      <div>
        <Skeleton variant="rounded" sx={{ width: "100%", height: "90vh" }} />
      </div>
    </>
  );
}
