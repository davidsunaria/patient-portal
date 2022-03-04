import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useHistory, useParams } from "react-router-dom";
import Article from "patient-portal-components/Dashboard/Article.js";
import { getLoggedinUserId, getUser, setLastPetId } from "patient-portal-utils/Service";


const ArticlesList = () => {

    const [searchData, setSearchData] = useState("");
    const [articles, setArticles] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [completed, setCompleted] = useState([]);



    const lastScrollTop = useRef(0);
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [isBottom, setIsBottom] = useState(false);
    const [formData, setFormData] = useState({});
       const getArticleList = useStoreActions((actions) => actions.Article.getArticleList);
       const response = useStoreState((state) => state.Article.response);


     useEffect(async () => {
          if (searchData) {
           setNextPageUrl(null);
           setCurrentPage(1);
           setPage(1);

           await getArticleList({ Type: "GET", search_key:searchData, query: { page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE } });
          // props.onLoad();
          }
         window.addEventListener('scroll', (e) => handleScroll(e), true);
         return () => {
           window.removeEventListener('scroll', (e) => handleScroll(e))
         };
       }, [searchData]);

      const handleScroll = useCallback((e) => {
        const scrollTop = parseInt(Math.max(e?.srcElement?.scrollTop));
        let st = scrollTop;
        if (st > lastScrollTop.current) {
          if (scrollTop + window.innerHeight + 50 >= e?.srcElement?.scrollHeight) {
            setIsBottom(true);
          }
        } else {
          setIsBottom(false);
        }
        setTimeout(() => {
          lastScrollTop.current = st <= 0 ? 0 : st;
        }, 0)
      }, []);

    //   useEffect(() => {
    //     if (isBottom && nextPageUrl) {
    //       console.log("Setting Page", isBottom, nextPageUrl, currentPage,parseInt(currentPage + 1) )
    //       setPage(parseInt(currentPage + 1));
    //     }
    //   }, [isBottom, nextPageUrl]);

    //   useEffect(() => {
    //     if (response) {
    //       let { status, statuscode, data } = response;
    //       if (statuscode && statuscode === 200) {

    //         if (data?.treatmentInstructions) {

    //           const { current_page, next_page_url, per_page } = data.treatmentInstructions;

    //           setCurrentPage(current_page);
    //           setNextPageUrl(next_page_url);
    //           setPerPage(per_page);

    //           let serverRespone = data.treatmentInstructions.data;
    //           if (current_page == 1) {
    //             setRecords(serverRespone);
    //           }
    //           else {
    //             serverRespone = [...records, ...serverRespone];
    //             setRecords(serverRespone);
    //           }
    //           setIsBottom(false);
    //         }

    //       }
    //     }
    //   }, [response]);






    return (
        <React.Fragment>
            <h1>Articles Page</h1>
            <div className="fieldOuter">
                <label className="fieldLabel">Name<span className="required">*</span></label>
                <div className="fieldBox">
                    <input
                        className={"fieldInput"}
                        placeholder="Enter pet name"
                        id="name"
                        name="name"
                        type="text"
                        value={searchData}
                        onChange={(e)=>{setSearchData(e.target.value)}}
                    />
                   
                </div>
            </div>

            <Article data={articles} />
        </React.Fragment>
    );
};

export default ArticlesList;
