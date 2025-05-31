

const Form = () => {
    return (
      <>
        <div className='relative overflow-x-hidden overflow-y-scroll h-screen w-full'>
          <div className='absolute w-full h-full overflow-x-hidden'>
            <form
              id='parentCVForm'
              className='w-full flex h-full bg-white transition-all items-stretch'
            >
              <input
                type='hidden'
                id='ActiveSelection'
                name='selectedCVType'
                value='1'
              />
              <div className='w-full flex-none self-auto overflow-y-scroll'>
                <div
                  data-translate='100'
                  className='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4'
                >
                  <h1 className='text-2xl font-bold'>Générateur de CV</h1>
                  <p className='font-bold'>
                    Confectionnez votre cv pas à pas lancez vous et choisissez
                    votre model
                  </p>
                  <div className='lg:grid w-full lg:gap-4 lg:grid-cols-3 flex flex-col gap-y-4'>
                    <input
                      type='image'
                      src='/static/screen/cv1.png'
                      alt='cv-type'
                      name='cvType'
                      value='1'
                      className='w-full h-[30rem] rounded-lg object-cover border-4 border-orange-500'
                    />
                    <input
                      type='image'
                      src='/static/screen/cv1.png'
                      alt='cv-type'
                      value='2'
                      name='cvType'
                      className='w-full h-[30rem] rounded-lg object-cover'
                    />
                    <input
                      type='image'
                      src='/static/screen/cv1.png'
                      alt='cv-type'
                      value='3'
                      name='cvType'
                      className='w-full h-[30rem] rounded-lg object-cover'
                    />
                  </div>
                  <button
                    type='button'
                    id='move'
                    className='w-[70%] mx-auto p-2 rounded-md font-bold bg-orange-500'
                  >
                    Commencer
                  </button>
                </div>
              </div>

              <div className='w-full self-auto flex-none overflow-y-scroll'>
                <div
                  data-translate='200'
                  id='first'
                  className='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative'
                >
                  <button className='absolute top-4 left-3' id='back' type='button'>
                    <i className='fa-solid fa-arrow-left fa-lg text-white'></i>
                  </button>
                  <h1 className='text-2xl font-bold ml-8'>
                    Informations personnelles
                  </h1>
                  <input
                    type='file'
                    name='userProfileFile'
                    accept='image/*'
                    id='fileInput'
                    className='hidden'
                  />
                  <img
                    src='/static/SVG/user.svg'
                    alt='user profile'
                    id='userSrcImg'
                    className='w-24 h-24 mx-auto rounded-full object-cover border-2 border-orange-500 p-2'
                  />
                  <input
                    type='text'
                    name='name'
                    placeholder='Saisissez votre nom complet'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <input
                    type='text'
                    name='email'
                    placeholder='Saisissez votre email'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <input
                    type='text'
                    name='phone'
                    placeholder='Saisissez votre numéro de téléphone'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <input
                    type='text'
                    name='adresse'
                    placeholder='Votre adresse/pays/ville'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <input
                    type='date'
                    name='birthday'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  <button
                    type='button'
                    id='move'
                    className='w-[70%] mx-auto p-2 mt-4 rounded-md font-bold bg-orange-500'
                  >
                    suite
                  </button>
                </div>
              </div>

              <div className='w-full self-auto flex-none overflow-y-scroll'>
                <div
                  data-translate='300'
                  className='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative'
                >
                  <button className='absolute top-4 left-3' id='back' type='button'>
                    <i className='fa-solid fa-arrow-left fa-lg text-white'></i>
                  </button>
                  <h1 className='text-2xl font-bold ml-8'>Profile</h1>
                  <textarea
                    name='profile'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    id='actuContent'
                    placeholder='Décrivez-vous'
                  ></textarea>
                  <div className='w-full mx-auto p-3 justify-center items-center'>
                    <div className='flex justify-between items-center w-full p-2'>
                      <h1 className='text-white font-bold text-2xl'>Compétences</h1>
                      <div id='listAdd'>
                        <i className='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                    </div>
                    <div
                      id=''
                      className='lst-component w-full flex flex-col gap-y-3'
                    >
                      <div
                        data-index='1'
                        className='vl-parent flex gap-x-4 w-11/12 items-center mt-4'
                      >
                        <div className='w-4 h-4 hidden lg:block rounded-full bg-white'></div>
                        <input
                          type='text'
                          name='skill'
                          id='listElement'
                          placeholder='Element'
                          className='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                        />
                        <div id='listRemoveBtn'>
                          <i className='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    id='formationGroupEl'
                    className='w-full mx-auto p-3 justify-center items-center'
                  >
                    <div className='flex justify-between items-center w-full p-2'>
                      <h1 className='text-white font-bold text-2xl'>Formations</h1>
                      <div id='addFormation'>
                        <i className='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                    </div>
                    <div className='lst-component w-full flex flex-col gap-y-3'>
                      <div
                        data-index='1'
                        className='vl-parent flex gap-x-4 w-full items-center mt-4'
                      >
                        <div className='w-4 h-4 hidden lg:block rounded-full bg-white'></div>
                        <div className='w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3'>
                          <input
                            type='text'
                            name='formation'
                            id='formationInput'
                            placeholder='Institut de formation'
                            className='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                          />
                          <input
                            type='text'
                            name='certificate'
                            id='certificateInput'
                            placeholder='diplôme'
                            className='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                          />
                          <input
                            type='text'
                            name='certificationDate'
                            id='certificationDateInput'
                            placeholder="période d'obtention"
                            className='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                          />
                        </div>
                        <div id='listRemoveBtn'>
                          <i className='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type='button'
                    id='move'
                    className='w-[70%] mx-auto p-2 mt-4 rounded-md font-bold bg-orange-500'
                  >
                    suite
                  </button>
                </div>
              </div>

              <div
                id='experienceGroup'
                className='w-full flex-none overflow-y-scroll'
              >
                <div
                  data-translate='400'
                  className='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative'
                >
                  <button className='absolute top-4 left-3' id='back' type='button'>
                    <i className='fa-solid fa-arrow-left fa-lg text-white'></i>
                  </button>
                  <h1 className='text-2xl font-bold ml-8'>
                    Expérience professionnelle
                  </h1>
                  <div
                    id=''
                    className='experienceGroupEl w-full mx-auto p-3 justify-center items-center'
                  >
                    <div className='flex justify-between items-center w-full lg:p-2'>
                      <div id='addExperience'>
                        <i className='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                      <input
                        type='text'
                        name='experience'
                        id='experienceInput'
                        data-group='1'
                        placeholder='Titre'
                        className='lg:w-9/12 w-w-full mr-2 bg-transparent p-2 text-white font-bold'
                      />
                    </div>
                    <div
                      id=''
                      className='lst-component w-full flex flex-col gap-y-3'
                    >
                      <div
                        data-index='1'
                        className='vl-parent flex gap-x-4 w-full items-center mt-4'
                      >
                        <div id='addTask'>
                          <i className='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                        </div>
                        <div className='w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3'>
                          <input
                            type='text'
                            name='task'
                            id='taskInput'
                            placeholder='descrition des tàches accomplies'
                            className='lg:w-9/12 w-full bg-transparent p-2 text-white font-bold'
                          />
                          <input
                            type='text'
                            name='taskDate'
                            id='taskDateInput'
                            placeholder='période'
                            className='lg:w-9/12 w-full bg-transparent p-2 text-white font-bold'
                          />
                        </div>
                        <div id='listRemoveBtn'>
                          <i className='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type='button'
                    id='move'
                    className='w-[70%] mx-auto p-2 mt-4 rounded-md font-bold bg-orange-500'
                  >
                    suite
                  </button>
                </div>
              </div>

              <div className='w-full flex-none overflow-y-scroll'>
                <div
                  data-translate='500'
                  className='lg:w-[80%] w-[98%] mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative'
                >
                  <button className='absolute top-4 left-3' id='back' type='button'>
                    <i className='fa-solid fa-arrow-left fa-lg text-white'></i>
                  </button>
                  <div className='w-full mx-auto p-3 justify-center items-center'>
                    <div className='flex justify-between items-center w-full p-2'>
                      <h1 className='text-white font-bold text-2xl'>
                        Vos centres d'intérêt
                      </h1>
                      <div id='addInterest'>
                        <i className='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                    </div>
                    <div
                      id=''
                      className='lst-component w-full flex flex-col gap-y-3'
                    >
                      <div
                        data-index='1'
                        className='vl-parent flex gap-x-4 w-11/12 items-center mt-4'
                      >
                        <div className='w-4 h-4 hidden lg:block rounded-full bg-white'></div>
                        <input
                          type='text'
                          name='interest'
                          id='listElement'
                          placeholder='Element'
                          className='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                        />
                        <div id='interestRemoveBtn'>
                          <i className='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    id='languageGroup'
                    className='w-full mx-auto p-3 justify-center items-center'
                  >
                    <div className='flex justify-between items-center w-full p-2'>
                      <h1 className='text-white font-bold text-2xl'>Langues</h1>
                      <div id='addLanguage'>
                        <i className='fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer'></i>
                      </div>
                    </div>
                    <div
                      id=''
                      className='lst-component w-full flex flex-col gap-y-3'
                    >
                      <div
                        data-index='1'
                        className='vl-parent flex gap-x-4 w-11/12 items-center mt-4'
                      >
                        <div className='w-4 h-4 hidden lg:block rounded-full bg-white'></div>
                        <div className='flex lg:flex-row flex-col gap-y-3 w-full justify-between'>
                          <input
                            type='text'
                            name='language'
                            id='languageInput'
                            placeholder='Element'
                            className='lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold'
                          />
                          <select
                            name=''
                            id='languageOption'
                            className='bg-gray-950 text-white'
                          >
                            <option value=''>niveau de langue</option>
                            <option value='basique'>Basique</option>
                            <option value='intermédiaire'>intermédiaire</option>
                            <option value='expérimenté'>expérimenté</option>
                          </select>
                        </div>
                        <div id='languageRemoveBtn'>
                          <i className='fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type='submit'
                    className='w-[70%] mx-auto p-2 mt-4 rounded-md font-bold bg-orange-500'
                  >
                    Créer votre CV
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
};

export default Form;