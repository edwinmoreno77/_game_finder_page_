import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { getGameById } from "../api/getData";
import { Navbar } from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export const Game = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { store, actions } = useContext(Context);

  const { addFavorites, removeFavorites } = actions;
  const { favorites } = store;

  const isFavorite = favorites.some((favorite) => favorite.id == id);
  const [like, setLike] = useState(isFavorite);

  const [showFullDescription, setShowFullDescription] = useState(false); // Estado para controlar la descripción

  const handlerLikes = (like, id) => {
    if (!favorites.some((favorite) => favorite.id == id)) {
      addFavorites(data);
    } else {
      removeFavorites(data);
    }
    setLike(!like);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGameById(id);
      setData(data);
    };

    fetchData();
  }, [id]);

  const platforms = data?.platforms
    ? data.platforms.map((p) => p.platform.name).join(", ")
    : "Unknown";

  const genres = data?.genres
    ? data.genres.map((g) => g.name).join(", ")
    : "Unknown";

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <>
      <Navbar />
      <main
        className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 1, 0.1), rgba(0, 0, 0, 1)), url(${data?.background_image_additional})`,
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row bg-gradient-to-t from-black via-black/50 to-transparent min-h-screen">
          {data ? (
            <motion.div
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="md:w-5/12 p-5 flex justify-center h-[calc(100vh-4rem)]"
            >
              <img
                src={data?.background_image}
                className="rounded-lg w-full h-full shadow-lg object-cover"
                alt={data?.name}
              />
            </motion.div>
          ) : (
            <div className="animate-pulse flex space-x-4">
              <div className="rounded bg-slate-500 m-5 h-96 w-96 md:ms-10 md:mt-7"></div>
            </div>
          )}

          {/* Información del juego */}
          <div className="w-full md:w-7/12 text-center md:pl-5 pb-5 text-stone-300">
            {data ? (
              <>
                <motion.h3
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5 }}
                  className="text-5xl my-5 font-extrabold text-white"
                >
                  {data?.name}
                </motion.h3>

                <div className="mt-4 p-1 font-serif text-sm text-stone-100 prose prose-invert">
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: showFullDescription ? "auto" : "13.5rem",
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden whitespace-pre-line"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: showFullDescription
                          ? data.description
                          : data.description.substring(0, 800) + "...",
                      }}
                    />
                  </motion.div>
                  <button
                    onClick={toggleDescription}
                    className="text-lime-500 underline mt-2 hover:text-lime-400 transition-colors"
                  >
                    {showFullDescription ? "Leer menos" : "Leer más"}
                  </button>
                </div>
                {/* Tráiler del juego */}
                <div className="my-5">
                  {data?.clip ? (
                    <video
                      controls
                      className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
                    >
                      <source src={data.clip.clip} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className="text-center text-white">
                      No trailer available.
                    </p>
                  )}
                </div>
                <p className="font-bold">
                  <span className="text-stone-300 text-base"> Platforms:</span>{" "}
                  <span className="text-white text-base">{platforms}</span>
                </p>
                <p className="font-bold">
                  <span className="text-stone-300 text-base"> genres:</span>{" "}
                  <span className="text-white text-base">{genres}</span>
                </p>
                <div className="flex justify-center gap-4 text-xs font-bold text-amber-400">
                  <span>Rating: {data?.rating}</span>{" "}
                  <span>Metacritic: {data?.metacritic ?? "Not available"}</span>
                </div>
                <p className="text-sm pt-2">Released: {data?.released}</p>

                {data.website && (
                  <a
                    href={data?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-lime-500 animate-pulse"
                  >
                    Website: {data?.website}
                  </a>
                )}

                <p className="text-xs">ID: {data?.id}</p>

                {/* Botones de "Atrás" y "Guardar en Favoritos" */}
                <div className="flex justify-between items-center mx-10 mt-2 pb-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="btn-primary px-4 py-1 hover:bg-lime-500 hover:scale-110 transition rounded bg-stone-700"
                  >
                    Back
                  </button>
                  <button onClick={() => handlerLikes(like, id)}>
                    <FontAwesomeIcon
                      icon={faBookmark}
                      className={`cursor-pointer text-2xl transition ease-in-out hover:scale-125 ${
                        like ? "text-lime-600" : "text-stone-700"
                      }`}
                    />
                  </button>
                </div>
              </>
            ) : (
              <p className="ps-10 mt-6 animate-pulse w-full">
                <span className="block bg-gray-300 h-6 w-9/12 mb-2"></span>
                <span className="block bg-gray-300 h-6 w-8/12 mb-2"></span>
                <span className="block bg-gray-300 h-6 w-4/12 mb-2"></span>
                <span className="block bg-gray-300 h-6 w-6/12 mb-2"></span>
                <span className="block bg-gray-300 h-6 w-8/12 mb-2"></span>
                <span className="block bg-gray-300 h-8 w-11/12 mb-2"></span>
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
