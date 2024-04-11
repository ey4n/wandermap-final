import { Image, Text, Avatar, Group, TypographyStylesProvider, Paper, MantineContext, MantineProvider, useMantineTheme, Rating } from '@mantine/core'
import { CarouselImage } from './CarouselImage';

// const Stars = ({rating}) => {
//     let stars = [];
//     for (let i = 1; i <= 5; i++) {
//         stars.push(<span key={i}>{i <= rating ? '⭐' : '☆'}</span>);
//     }
//     return <div>{stars}</div>;
// }


const Comments = ({comment, user}) => {
    const theme = useMantineTheme();
    // console.log(user.image); 
  return (
    <MantineProvider>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Paper withBorder radius="md" style={{margin: '5px',width: '90%', 
            // borderColor: theme.colors['forest-green'][2], borderWidth: '5px',
            backgroundColor: theme.colors['pastel-purple'][1]
            }}>
            <div style={{display: 'flex'}}>
                <div style={{margin:'20px', flex: 1}}>
                    <Image
                    src=
                    {
                        user ? user.image : 
                        "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?w=740&t=st=1711611665~exp=1711612265~hmac=f5f26ef0de4fa71d76b065586a098f68ea5a8a05a80e4580e8d7710deabc2692"}
                    radius="sm"
                    />
                </div>
                <div style={{flex: 4}}>
                    <Text fw={700} size= 'xl' style={{marginTop:'10px'}}>{user ? user.name: "Loading name..."}</Text>
                    <TypographyStylesProvider> 
                        <div  style={{paddingTop: '10px', fontSize: '14px'}}>Comment: {comment.comment}</div>
                        <div style={{paddingTop: '10px', paddingBottom: '10px', }}>
                            Rating: 
                            {/* <Stars rating={comment.rating} />/ */}
                            <Rating value={comment.rating} readOnly />
                        </div>
                    </TypographyStylesProvider>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px', width: '90%'}}>
                        {comment && <CarouselImage imageUrls={comment.imageUrl}></CarouselImage>}


                    </div>
                </div>
                
            </div>
            </Paper>

        </div>

    </MantineProvider>
  );
}

export default Comments;