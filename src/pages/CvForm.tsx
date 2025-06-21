const Form = () => {
  return (
    <>
      <div className="relative h-screen w-full overflow-x-hidden overflow-y-scroll">
        <div className="absolute h-full w-full overflow-x-hidden">
          <form
            id="parentCVForm"
            className="flex h-full w-full items-stretch bg-white transition-all"
          >
            <input
              type="hidden"
              id="ActiveSelection"
              name="selectedCVType"
              value="1"
            />
            <div className="w-full flex-none self-auto overflow-y-scroll">
              <div
                data-translate="100"
                className="mx-auto mb-4 mt-4 flex w-[98%] flex-col gap-y-6 rounded-lg bg-gray-950 p-4 text-white shadow-lg shadow-black lg:w-[80%]"
              >
                <h1 className="text-2xl font-bold">Générateur de CV</h1>
                <p className="font-bold">
                  Confectionnez votre cv pas à pas lancez vous et choisissez votre model
                </p>
                <div className="flex w-full flex-col gap-y-4 lg:grid lg:grid-cols-3 lg:gap-4">
                  <input
                    type="image"
                    src="/static/screen/cv1.png"
                    alt="cv-type"
                    name="cvType"
                    value="1"
                    className="h-[30rem] w-full rounded-lg border-4 border-orange-500 object-cover"
                  />
                  <input
                    type="image"
                    src="/static/screen/cv1.png"
                    alt="cv-type"
                    value="2"
                    name="cvType"
                    className="h-[30rem] w-full rounded-lg object-cover"
                  />
                  <input
                    type="image"
                    src="/static/screen/cv1.png"
                    alt="cv-type"
                    value="3"
                    name="cvType"
                    className="h-[30rem] w-full rounded-lg object-cover"
                  />
                </div>
                <button
                  type="button"
                  id="move"
                  className="mx-auto w-[70%] rounded-md bg-orange-500 p-2 font-bold"
                >
                  Commencer
                </button>
              </div>
            </div>

            <div className="w-full flex-none self-auto overflow-y-scroll">
              <div
                data-translate="200"
                id="first"
                className="relative mx-auto mb-4 mt-4 flex w-[98%] flex-col gap-y-6 rounded-lg bg-gray-950 p-4 text-white shadow-lg shadow-black lg:w-[80%]"
              >
                <button
                  className="absolute left-3 top-4"
                  id="back"
                  type="button"
                >
                  <i className="fa-solid fa-arrow-left fa-lg text-white"></i>
                </button>
                <h1 className="ml-8 text-2xl font-bold">Informations personnelles</h1>
                <input
                  type="file"
                  name="userProfileFile"
                  accept="image/*"
                  id="fileInput"
                  className="hidden"
                />
                <img
                  src="/static/SVG/user.svg"
                  alt="user profile"
                  id="userSrcImg"
                  className="mx-auto h-24 w-24 rounded-full border-2 border-orange-500 object-cover p-2"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Saisissez votre nom complet"
                  className="border-stroke focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus-visible:shadow-none"
                />
                <input
                  type="text"
                  name="email"
                  placeholder="Saisissez votre email"
                  className="border-stroke focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus-visible:shadow-none"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Saisissez votre numéro de téléphone"
                  className="border-stroke focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus-visible:shadow-none"
                />
                <input
                  type="text"
                  name="adresse"
                  placeholder="Votre adresse/pays/ville"
                  className="border-stroke focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus-visible:shadow-none"
                />
                <input
                  type="date"
                  name="birthday"
                  className="border-stroke focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus-visible:shadow-none"
                />
                <button
                  type="button"
                  id="move"
                  className="mx-auto mt-4 w-[70%] rounded-md bg-orange-500 p-2 font-bold"
                >
                  suite
                </button>
              </div>
            </div>

            <div className="w-full flex-none self-auto overflow-y-scroll">
              <div
                data-translate="300"
                className="relative mx-auto mb-4 mt-4 flex w-[98%] flex-col gap-y-6 rounded-lg bg-gray-950 p-4 text-white shadow-lg shadow-black lg:w-[80%]"
              >
                <button
                  className="absolute left-3 top-4"
                  id="back"
                  type="button"
                >
                  <i className="fa-solid fa-arrow-left fa-lg text-white"></i>
                </button>
                <h1 className="ml-8 text-2xl font-bold">Profile</h1>
                <textarea
                  name="profile"
                  className="border-stroke focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus-visible:shadow-none"
                  id="actuContent"
                  placeholder="Décrivez-vous"
                ></textarea>
                <div className="mx-auto w-full items-center justify-center p-3">
                  <div className="flex w-full items-center justify-between p-2">
                    <h1 className="text-2xl font-bold text-white">Compétences</h1>
                    <div id="listAdd">
                      <i className="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"></i>
                    </div>
                  </div>
                  <div
                    id=""
                    className="lst-component flex w-full flex-col gap-y-3"
                  >
                    <div
                      data-index="1"
                      className="vl-parent mt-4 flex w-11/12 items-center gap-x-4"
                    >
                      <div className="hidden h-4 w-4 rounded-full bg-white lg:block"></div>
                      <input
                        type="text"
                        name="skill"
                        id="listElement"
                        placeholder="Element"
                        className="w-11/12 bg-transparent p-2 font-bold text-white lg:w-9/12"
                      />
                      <div id="listRemoveBtn">
                        <i className="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id="formationGroupEl"
                  className="mx-auto w-full items-center justify-center p-3"
                >
                  <div className="flex w-full items-center justify-between p-2">
                    <h1 className="text-2xl font-bold text-white">Formations</h1>
                    <div id="addFormation">
                      <i className="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"></i>
                    </div>
                  </div>
                  <div className="lst-component flex w-full flex-col gap-y-3">
                    <div
                      data-index="1"
                      className="vl-parent mt-4 flex w-full items-center gap-x-4"
                    >
                      <div className="hidden h-4 w-4 rounded-full bg-white lg:block"></div>
                      <div className="flex w-full flex-col gap-y-3 lg:grid lg:grid-cols-2">
                        <input
                          type="text"
                          name="formation"
                          id="formationInput"
                          placeholder="Institut de formation"
                          className="w-11/12 bg-transparent p-2 font-bold text-white lg:w-9/12"
                        />
                        <input
                          type="text"
                          name="certificate"
                          id="certificateInput"
                          placeholder="diplôme"
                          className="w-11/12 bg-transparent p-2 font-bold text-white lg:w-9/12"
                        />
                        <input
                          type="text"
                          name="certificationDate"
                          id="certificationDateInput"
                          placeholder="période d'obtention"
                          className="w-11/12 bg-transparent p-2 font-bold text-white lg:w-9/12"
                        />
                      </div>
                      <div id="listRemoveBtn">
                        <i className="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  id="move"
                  className="mx-auto mt-4 w-[70%] rounded-md bg-orange-500 p-2 font-bold"
                >
                  suite
                </button>
              </div>
            </div>

            <div
              id="experienceGroup"
              className="w-full flex-none overflow-y-scroll"
            >
              <div
                data-translate="400"
                className="relative mx-auto mb-4 mt-4 flex w-[98%] flex-col gap-y-6 rounded-lg bg-gray-950 p-4 text-white shadow-lg shadow-black lg:w-[80%]"
              >
                <button
                  className="absolute left-3 top-4"
                  id="back"
                  type="button"
                >
                  <i className="fa-solid fa-arrow-left fa-lg text-white"></i>
                </button>
                <h1 className="ml-8 text-2xl font-bold">Expérience professionnelle</h1>
                <div
                  id=""
                  className="experienceGroupEl mx-auto w-full items-center justify-center p-3"
                >
                  <div className="flex w-full items-center justify-between lg:p-2">
                    <div id="addExperience">
                      <i className="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"></i>
                    </div>
                    <input
                      type="text"
                      name="experience"
                      id="experienceInput"
                      data-group="1"
                      placeholder="Titre"
                      className="w-w-full mr-2 bg-transparent p-2 font-bold text-white lg:w-9/12"
                    />
                  </div>
                  <div
                    id=""
                    className="lst-component flex w-full flex-col gap-y-3"
                  >
                    <div
                      data-index="1"
                      className="vl-parent mt-4 flex w-full items-center gap-x-4"
                    >
                      <div id="addTask">
                        <i className="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"></i>
                      </div>
                      <div className="flex w-full flex-col gap-y-3 lg:grid lg:grid-cols-2">
                        <input
                          type="text"
                          name="task"
                          id="taskInput"
                          placeholder="descrition des tàches accomplies"
                          className="w-full bg-transparent p-2 font-bold text-white lg:w-9/12"
                        />
                        <input
                          type="text"
                          name="taskDate"
                          id="taskDateInput"
                          placeholder="période"
                          className="w-full bg-transparent p-2 font-bold text-white lg:w-9/12"
                        />
                      </div>
                      <div id="listRemoveBtn">
                        <i className="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  id="move"
                  className="mx-auto mt-4 w-[70%] rounded-md bg-orange-500 p-2 font-bold"
                >
                  suite
                </button>
              </div>
            </div>

            <div className="w-full flex-none overflow-y-scroll">
              <div
                data-translate="500"
                className="relative mx-auto mb-4 mt-4 flex w-[98%] flex-col gap-y-6 rounded-lg bg-gray-950 p-4 text-white shadow-lg shadow-black lg:w-[80%]"
              >
                <button
                  className="absolute left-3 top-4"
                  id="back"
                  type="button"
                >
                  <i className="fa-solid fa-arrow-left fa-lg text-white"></i>
                </button>
                <div className="mx-auto w-full items-center justify-center p-3">
                  <div className="flex w-full items-center justify-between p-2">
                    <h1 className="text-2xl font-bold text-white">Vos centres d'intérêt</h1>
                    <div id="addInterest">
                      <i className="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"></i>
                    </div>
                  </div>
                  <div
                    id=""
                    className="lst-component flex w-full flex-col gap-y-3"
                  >
                    <div
                      data-index="1"
                      className="vl-parent mt-4 flex w-11/12 items-center gap-x-4"
                    >
                      <div className="hidden h-4 w-4 rounded-full bg-white lg:block"></div>
                      <input
                        type="text"
                        name="interest"
                        id="listElement"
                        placeholder="Element"
                        className="w-11/12 bg-transparent p-2 font-bold text-white lg:w-9/12"
                      />
                      <div id="interestRemoveBtn">
                        <i className="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id="languageGroup"
                  className="mx-auto w-full items-center justify-center p-3"
                >
                  <div className="flex w-full items-center justify-between p-2">
                    <h1 className="text-2xl font-bold text-white">Langues</h1>
                    <div id="addLanguage">
                      <i className="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"></i>
                    </div>
                  </div>
                  <div
                    id=""
                    className="lst-component flex w-full flex-col gap-y-3"
                  >
                    <div
                      data-index="1"
                      className="vl-parent mt-4 flex w-11/12 items-center gap-x-4"
                    >
                      <div className="hidden h-4 w-4 rounded-full bg-white lg:block"></div>
                      <div className="flex w-full flex-col justify-between gap-y-3 lg:flex-row">
                        <input
                          type="text"
                          name="language"
                          id="languageInput"
                          placeholder="Element"
                          className="w-11/12 bg-transparent p-2 font-bold text-white lg:w-9/12"
                        />
                        <select
                          name=""
                          id="languageOption"
                          className="bg-gray-950 text-white"
                        >
                          <option value="">niveau de langue</option>
                          <option value="basique">Basique</option>
                          <option value="intermédiaire">intermédiaire</option>
                          <option value="expérimenté">expérimenté</option>
                        </select>
                      </div>
                      <div id="languageRemoveBtn">
                        <i className="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mx-auto mt-4 w-[70%] rounded-md bg-orange-500 p-2 font-bold"
                >
                  Créer votre CV
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Form
