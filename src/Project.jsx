export default function Project ({ title, desc, list = [], img, page }) {

    return (
        <div className="bg-current flex-auto">
            <div className="py-5 px-2">
                <div className="border-2 border-primary-300 rounded-xl">
                    <div className="text-3xl text-primary-400 font-extrabold font-sans-inter py-3">
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
                        <div className="flex flex-col px-2 py-2">
                            <a  href={page}
                                className="hover:border-2 hover:border-primary-200 rounded-xl"
                            >
                                <img src={img} className="rounded-xl"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}