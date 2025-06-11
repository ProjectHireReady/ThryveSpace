export const useJournal = () => {
  const saveEntry = async (entry, mood) => {
    console.log('Saving journal entry:', { entry, mood });
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return { saveEntry };
};
