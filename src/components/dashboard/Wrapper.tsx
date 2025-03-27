import { FC, PropsWithChildren } from 'hono/jsx';

export type Props = PropsWithChildren<{
  user?: string;
}>;


const Wrapper: FC<Props> = ({ children }) => {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            {children}
        </div>
    );
};

export default Wrapper;