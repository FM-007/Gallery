import { useState, useEffect, FormEvent } from 'react';
import * as Photo from './services/photos'
import { PhotoItem } from './components/PhotosItem';
import * as C from './App.styles';
import { Photos } from './types/Photos';

const App: React.FC = () => {
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState<Photos[]>([]);

    useEffect(() => {
        const getPhoto = async () => {
            setLoading(true);
            setPhotos(await Photo.getAll());
            setLoading(false);
        }
        getPhoto();
    }, [])

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const file = formData.get('image') as File;

        if (file && file.size > 0) {
            setUploading(true);
            let result = await Photo.insert(file);
            setUploading(false);

            if (result instanceof Error) {
                alert(`${result.name} - ${result.message}`)
            } else {
                let newPhotoList = [...photos];
                newPhotoList.push(result);
                setPhotos(newPhotoList);
            }
        }
    }

    return (
        <>
            <C.GlobalStyle />
            <C.Container>
                <C.Area>
                    <C.Header>Galeria de Fotos</C.Header>

                    <C.UploadForm method='POST' onSubmit={handleFormSubmit}>
                        <input type="file" name='image' />
                        <input type="submit" value="Enviar" />
                        {uploading && 'Enviando...'}
                    </C.UploadForm>

                    {loading &&
                        <C.ScreenWarning>
                            <div className="emoji">✋</div>
                            <div>Carregando ...</div>
                        </C.ScreenWarning>
                    }

                    {!loading && photos.length > 0 &&
                        <C.PhotoList>
                            {photos.map((item, index) => (
                                <PhotoItem key={index} name={item.name} url={item.url} />
                            ))}
                        </C.PhotoList>
                    }

                    {!loading && photos.length === 0 &&
                        <C.ScreenWarning>
                            <div className="emoji">😢</div>
                            <div>Não há fotos cadastradas !!!</div>
                        </C.ScreenWarning>
                    }
                </C.Area>
            </C.Container>
        </>
    );
}

export default App;