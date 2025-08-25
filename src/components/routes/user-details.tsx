import { useParams } from 'react-router-dom';

export default function UserDetails() {
    const { userId } = useParams();

    return (
        <div className="flex h-full items-center justify-center">
            <h1 className="text-2xl font-bold">User Details - {userId}</h1>
        </div>
    );
}
