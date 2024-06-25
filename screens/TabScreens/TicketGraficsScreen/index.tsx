import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { getTicketsAsync } from "../../../database";
import { Ticket } from "../../../database";
import Carousel from "react-native-reanimated-carousel";

const screenWidth = Dimensions.get("window").width;

function TicketsGraficScreen() {
  const [items, setItems] = useState<Ticket[]>([]);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  // const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // const carouselRef = useRef<Carousel<Ticket>>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await getTicketsAsync();
      setItems(tickets);
    };

    fetchTickets();
  }, []);

  // useEffect(() => {
  //   if (!isCarouselPaused) {
  //     autoPlayRef.current = setTimeout(() => {
  //       carouselRef.current?.snapToNext();
  //     }, 3000);
  //   }

  //   return () => {
  //     if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
  //   };
  // }, [isCarouselPaused, items]);

  const chartData = () => {
    const statusCounts = {
      abertos: 0,
      encerrados: 0,
      improcedentes: 0,
      cancelados: 0,
    };

    items.forEach((ticket) => {
      if (ticket.status === "1") statusCounts.abertos += 1;
      else if (ticket.status === "2") statusCounts.encerrados += 1;
      else if (ticket.status === "3") statusCounts.improcedentes += 1;
      else if (ticket.status === "4") statusCounts.cancelados += 1;
    });

    return [
      { name: "Abertos", count: statusCounts.abertos, color: "blue", legendFontColor: "#7F7F7F", legendFontSize: 15 },
      {
        name: "Encerrados",
        count: statusCounts.encerrados,
        color: "green",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      },
      {
        name: "Improcedentes",
        count: statusCounts.improcedentes,
        color: "red",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      },
      {
        name: "Cancelados",
        count: statusCounts.cancelados,
        color: "orange",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      },
    ].filter((data) => data.count > 0);
  };

  const totalTickets = items.length;
  const totalEncerradosTempo = items
    .filter((item) => item.status === "2")
    .reduce((acc, item) => {
      return acc + 10; //item.tempoEncerramento;
    }, 0);
  const mediaEncerramento = totalEncerradosTempo / items.filter((item) => item.status === "2").length;
  const top5Tickets = items
    .filter((item) => item.status === "2") // Filtra por tickets encerrados
    .sort((a, b) => 7 /*a.tempoEncerramento*/ - 3 /*b.tempoEncerramento*/) // Ordena pelo tempo de encerramento
    .slice(0, 5); // Pega os TOP 5

  // Função para renderizar cada item do carousel
  const renderItem = ({ item, index }: any) => {
    return (
      <View>
        <Text>{`Ticket: ${item.id} - ${item.titulo}`}</Text>
        <Text>{`Tempo de Encerramento: ${item.tempoEncerramento} minutos`}</Text>
      </View>
    );
  };

  return (
    <View>
      <PieChart
        data={chartData()}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={"count"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 10]}
        absolute
      />
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo dos Tickets</Text>
        <Text style={styles.summaryText}>Total de Tickets: {totalTickets}</Text>
        <Text style={styles.summaryText}>
          Média de Tempo de Encerramento: {isNaN(mediaEncerramento) ? 0 : mediaEncerramento.toFixed(2)} minutos
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>Top 5 Tickets Fechados com Menor Tempo</Text>
      </View>
      <Carousel
        loop
        width={screenWidth}
        height={200}
        autoPlay={true}
        data={top5Tickets}
        scrollAnimationDuration={3000}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ item, index }) => (
          <View style={styles.carouselItem}>
            <Text style={styles.ticketId}>{`Ticket ID: ${item.id}`}</Text>
            {/* <Text style={styles.ticketInfo}>{`Tempo de Encerramento: ${item.tempoEncerramento} minutos`}</Text> */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginLeft: 25,
    marginRight: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ticketId: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ticketInfo: {
    fontSize: 16,
  },
  descriptionContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
  },
});

export default TicketsGraficScreen;
