import { useState, createContext, useMemo, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";

const LanguageContext = createContext();

const LanguageProvider = (props) => {
    const [labelData, setLabelData] = useState("");

    const value = useMemo(() => ({ labelData, setLabelData }), [labelData]);
    const getTranslations = useStoreActions(
        (actions) => actions.auth.getTranslations
    );

    useEffect(async () => {
        let data = await getTranslations();
        console.log(data);
        setLabelData(data);
    }, []);
    return (
        <LanguageContext.Provider value={value}>
            {props.children}
        </LanguageContext.Provider>
    );
};
export { LanguageContext, LanguageProvider };
