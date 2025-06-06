

const Form = () => {
    return (
      <>
        <div class='relative overflow-x-hidden overflow-y-scroll h-screen w-full'>
          <div class='absolute w-full h-full overflow-x-hidden'>
            <form
              id='parentCVForm'
              class='w-full flex h-full bg-white transition-all items-stretch'
            >
              <input
                type='hidden'
                id='ActiveSelection'
                name='selectedCVType'
                value='1'
              />
              <div class='w-full flex-none self-auto overflow-y-scroll'>
                <div
                  data-translate='100'
                  class='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4'
                >
                  <h1 class='text-2xl font-bold'>Générateur de CV</h1>
                  <p class='font-bold'>
                    Confectionnez votre cv pas à pas lancez vous et choisissez
                    votre model
                  </p>
                  <div class='lg:grid w-full lg:gap-4 lg:grid-cols-3 flex flex-col gap-y-4'>
                    <input
                      type='image'
                      src='/static/screen/cv1.png'
                      alt='cv-type'
                      name='cvType'
                      value='1'
                      class='w-full h-[30rem] rounded-lg object-cover border-4 border-orange-500'
                    />
                    <input
                      type='image'
                      src='/static/screen/cv1.png'
                      alt='cv-type'
                      value='2'
                      name='cvType'
                      class='w-full h-[30rem] rounded-lg object-cover'
                    />
                    <input
                      type='image'
                      src='/static/screen/cv1.png'
                      alt='cv-type'
                      value='3'
                      name='cvType'
                      class='w-full h-[30rem] rounded-lg object-cover'
                    />
                  </div>
                  <button
                    type='button'
                    id='move'
                    class='w-[70%] mx-auto p-2 rounded-md font-bold bg-orange-500'
                  >
                    Commencer
                  </button>
                </div>
              </div>

              <div class='w-full self-auto flex-none overflow-y-scroll'>
                <div
                  data-translate='200'
                  id='first'
                  class='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative'
                >
                  <button class='absolute top-4 left-3' id='back' type='button'>
                    <i class='fa-solid fa-arrow-left fa-lg text-white'></i>
                  </button>
                  <h1 class='text-2xl font-bold ml-8'>
                    Informations personnelles
                  </h1>
                  <input
                    type='file'
                    name='userProfileFile'
                    accept='image/*'
                    id='fileInput'
                    class='hidden'
                  />
                  <img
                    src='/static/SVG/user.svg'
                    alt='user profile'
                    id='userSrcImg'
                    class='w-24 h-24 mx-auto rounded-full object-cover border-2 border-orange-500 p-2'
                  />
                  <input
                    type='text'
                    name='name'
                    placeholder='Saisissez votre nom complet'
                    class='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <input
                    type='text'
                    name='email'
                    placeholder='Saisissez votre email'
                    class='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <input
                    type='text'
                    name='phone'
                    placeholder='Saisissez votre numéro de téléphone'
                    class='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <input
                    type='text'
                    name='adresse'
                    placeholder='Votre adresse/pays/ville'
                    class='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <input
                    type='date'
                    name='birthday'
                    class='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <button
                    type='button'
                    id='move'
                    class='w-[70%] mx-auto p-2 mt-4 rounded-md font-bold bg-orange-500'
                  >
                    suite
                  </button>
                </div>
              </div>

              <div class='w-full self-auto flex-none overflow-y-scroll'>
                <div
                  data-translate='300'
                  class='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative'
                >
                  <button class='absolute top-4 left-3' id='back' type='button'>
                    <i class='fa-solid fa-arrow-left fa-lg text-white'></i>
                  </button>
                  <h1 class='text-2xl font-bold ml-8'>Profile</h1>
                  <textarea
                    name='profile'
                    class='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    id='actuContent'
                    placeholder='Décrivez-vous'
                  ></textarea>
                  <div class='w-full mx-auto p-3 justify-center items-center'>
                    <div class='flex justify-between items-center w-full p-2'>
                      <h1 class='text-white font-bold text-2xl'>Compétences</h1>
                      <div id='listAdd'>
                        <i class='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                    </div>
                    <div
                      id=''
                      class='lst-component w-full flex flex-col gap-y-3'
                    >
                      <div
                        data-index='1'
                        class='vl-parent flex gap-x-4 w-11/12 items-center mt-4'
                      >
                        <div class='w-4 h-4 hidden lg:block rounded-full bg-white'></div>
                        <input
                          type='text'
                          name='skill'
                          id='listElement'
                          placeholder='Element'
                          class='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                        />
                        <div id='listRemoveBtn'>
                          <i class='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    id='formationGroupEl'
                    class='w-full mx-auto p-3 justify-center items-center'
                  >
                    <div class='flex justify-between items-center w-full p-2'>
                      <h1 class='text-white font-bold text-2xl'>Formations</h1>
                      <div id='addFormation'>
                        <i class='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                    </div>
                    <div class='lst-component w-full flex flex-col gap-y-3'>
                      <div
                        data-index='1'
                        class='vl-parent flex gap-x-4 w-full items-center mt-4'
                      >
                        <div class='w-4 h-4 hidden lg:block rounded-full bg-white'></div>
                        <div class='w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3'>
                          <input
                            type='text'
                            name='formation'
                            id='formationInput'
                            placeholder='Institut de formation'
                            class='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                          />
                          <input
                            type='text'
                            name='certificate'
                            id='certificateInput'
                            placeholder='diplôme'
                            class='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                          />
                          <input
                            type='text'
                            name='certificationDate'
                            id='certificationDateInput'
                            placeholder="période d'obtention"
                            class='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                          />
                        </div>
                        <div id='listRemoveBtn'>
                          <i class='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type='button'
                    id='move'
                    class='w-[70%] mx-auto p-2 mt-4 rounded-md font-bold bg-orange-500'
                  >
                    suite
                  </button>
                </div>
              </div>

              <div
                id='experienceGroup'
                class='w-full flex-none overflow-y-scroll'
              >
                <div
                  data-translate='400'
                  class='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative'
                >
                  <button class='absolute top-4 left-3' id='back' type='button'>
                    <i class='fa-solid fa-arrow-left fa-lg text-white'></i>
                  </button>
                  <h1 class='text-2xl font-bold ml-8'>
                    Expérience professionnelle
                  </h1>
                  <div
                    id=''
                    class='experienceGroupEl w-full mx-auto p-3 justify-center items-center'
                  >
                    <div class='flex justify-between items-center w-full lg:p-2'>
                      <div id='addExperience'>
                        <i class='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                      <input
                        type='text'
                        name='experience'
                        id='experienceInput'
                        data-group='1'
                        placeholder='Titre'
                        class='lg:w-9/12 w-w-full mr-2 bg-transparent p-2 text-white font-bold'
                      />
                    </div>
                    <div
                      id=''
                      class='lst-component w-full flex flex-col gap-y-3'
                    >
                      <div
                        data-index='1'
                        class='vl-parent flex gap-x-4 w-full items-center mt-4'
                      >
                        <div id='addTask'>
                          <i class='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                        </div>
                        <div class='w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3'>
                          <input
                            type='text'
                            name='task'
                            id='taskInput'
                            placeholder='descrition des tàches accomplies'
                            class='lg:w-9/12 w-full bg-transparent p-2 text-white font-bold'
                          />
                          <input
                            type='text'
                            name='taskDate'
                            id='taskDateInput'
                            placeholder='période'
                            class='lg:w-9/12 w-full bg-transparent p-2 text-white font-bold'
                          />
                        </div>
                        <div id='listRemoveBtn'>
                          <i class='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type='button'
                    id='move'
                    class='w-[70%] mx-auto p-2 mt-4 rounded-md font-bold bg-orange-500'
                  >
                    suite
                  </button>
                </div>
              </div>

              <div class='w-full flex-none overflow-y-scroll'>
                <div
                  data-translate='500'
                  class='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative'
                >
                  <button class='absolute top-4 left-3' id='back' type='button'>
                    <i class='fa-solid fa-arrow-left fa-lg text-white'></i>
                  </button>
                  <div class='w-full mx-auto p-3 justify-center items-center'>
                    <div class='flex justify-between items-center w-full p-2'>
                      <h1 class='text-white font-bold text-2xl'>
                        Vos centres d'intérêt
                      </h1>
                      <div id='addInterest'>
                        <i class='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                    </div>
                    <div
                      id=''
                      class='lst-component w-full flex flex-col gap-y-3'
                    >
                      <div
                        data-index='1'
                        class='vl-parent flex gap-x-4 w-11/12 items-center mt-4'
                      >
                        <div class='w-4 h-4 hidden lg:block rounded-full bg-white'></div>
                        <input
                          type='text'
                          name='interest'
                          id='listElement'
                          placeholder='Element'
                          class='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                        />
                        <div id='interestRemoveBtn'>
                          <i class='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    id='languageGroup'
                    class='w-full mx-auto p-3 justify-center items-center'
                  >
                    <div class='flex justify-between items-center w-full p-2'>
                      <h1 class='text-white font-bold text-2xl'>Langues</h1>
                      <div id='addLanguage'>
                        <i class='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                    </div>
                    <div
                      id=''
                      class='lst-component w-full flex flex-col gap-y-3'
                    >
                      <div
                        data-index='1'
                        class='vl-parent flex gap-x-4 w-11/12 items-center mt-4'
                      >
                        <div class='w-4 h-4 hidden lg:block rounded-full bg-white'></div>
                        <div class='flex lg:flex-row flex-col gap-y-3 w-full justify-between'>
                          <input
                            type='text'
                            name='language'
                            id='languageInput'
                            placeholder='Element'
                            class='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                          />
                          <select
                            name=''
                            id='languageOption'
                            class='bg-gray-950 text-white'
                          >
                            <option value=''>niveau de langue</option>
                            <option value='basique'>Basique</option>
                            <option value='intermédiaire'>intermédiaire</option>
                            <option value='expérimenté'>expérimenté</option>
                          </select>
                        </div>
                        <div id='languageRemoveBtn'>
                          <i class='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type='submit'
                    class='w-[70%] mx-auto p-2 mt-4 rounded-md font-bold bg-orange-500'
                  >
                    Créer votre CV
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <script type='module' src='/static/js/cv.js'></script>
      </>
    );
};

export default Form;