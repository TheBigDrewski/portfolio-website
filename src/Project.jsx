export default function Project ({ title, desc, list = [], img, page }) {

    return (
        <div className="bg-current flex-auto">
            <div className="py-5 px-2">
                <div className="bg-primary-500 rounded-xl shadow-xl">
                    <div className="text-3xl text-light font-extrabold font-sans-inter py-3">
                        {title}
                    </div>
                    <div className="flex flex-row">
                        <div>
                            <div className="text-lg text-light font-sans-inter px-2 pt-1" >
                                {desc}
                            </div>
                            <div className="pt-4">
                                {list.length > 0 && (
                                    <div className="flex justify-center underline text-xl text-light font-bold font-sans-inter">
                                        To Do List
                                    </div>
                                )}    
                                {list.length > 0 && (
                                    <ul className="list-disc list-inside text-light text-left pl-8 space-y-1">
                                        {list.map((l, i) => 
                                            <li key={i}>{l}</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <a  href={page}
                                className="hover:bg-primary-400 rounded-2xl"
                            >
                                <img src={img} className="p-2 rounded-3xl"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}