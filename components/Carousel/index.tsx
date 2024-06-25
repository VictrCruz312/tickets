import Carousel from 'react-native-snap-carousel';

// Supondo que você tenha uma função para calcular os TOP 5 tickets
const top5Tickets = items.filter(item => item.status === "2") // Filtra por tickets encerrados
  .sort((a, b) => a.tempoEncerramento - b.tempoEncerramento) // Ordena pelo tempo de encerramento
  .slice(0, 5); // Pega os TOP 5

// Função para renderizar cada item do carousel
const renderItem = ({item, index}) => {
  return (
    <View>
      <Text>{`Ticket ID: ${item.id}`}</Text>
      <Text>{`Tempo de Encerramento: ${item.tempoEncerramento} minutos`}</Text>
    </View>
  );
};

// No seu JSX
<Carousel
  data={top5Tickets}
  renderItem={renderItem}
  sliderWidth={screenWidth}
  itemWidth={300}
/>