import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Modal, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { COLORS, SIZES } from "../theme";
import api from "../api";

const SupportTicketsScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Ticket Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Detail Modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tickets/my-tickets');
      setTickets(data);
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch tickets' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill all fields' });
      return;
    }
    try {
      setCreating(true);
      await api.post('/tickets', { subject, description });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Ticket created successfully' });
      setShowCreateModal(false);
      setSubject("");
      setDescription("");
      fetchTickets();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to create ticket' });
    } finally {
      setCreating(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    try {
      setReplying(true);
      const { data } = await api.post(`/tickets/${selectedTicket._id}/reply`, { message: replyMessage });
      setSelectedTicket(data);
      setReplyMessage("");
      fetchTickets();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to send reply' });
    } finally {
      setReplying(false);
    }
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity style={styles.ticketCard} onPress={() => setSelectedTicket(item)}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>#{item._id.substring(item._id.length - 6).toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'open' ? COLORS.secondary : item.status === 'closed' ? COLORS.textLight : COLORS.primary }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.ticketSubject}>{item.subject}</Text>
      <Text style={styles.ticketDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Support Tickets</Text>
        <TouchableOpacity style={styles.newTicketButton} onPress={() => setShowCreateModal(true)}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.newTicketText}>New Ticket</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : tickets.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={70} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>No Tickets Yet</Text>
          <Text style={styles.emptySubtitle}>You haven't opened any support tickets. If you need help, feel free to create one!</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item._id}
          renderItem={renderTicket}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Create Ticket Modal */}
      <Modal visible={showCreateModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Ticket</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Subject (e.g. Order #12345 delayed)" value={subject} onChangeText={setSubject} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Describe your issue..." value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />
            <TouchableOpacity style={styles.submitBtn} onPress={handleCreateTicket} disabled={creating}>
              {creating ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Submit Ticket</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Ticket Detail Modal */}
      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { flex: 0.9, padding: 0 }]}>
            <View style={[styles.modalHeader, { padding: 16, borderBottomWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white, borderTopLeftRadius: SIZES.radius, borderTopRightRadius: SIZES.radius }]}>
              <Text style={styles.modalTitle}>Ticket Details</Text>
              <TouchableOpacity onPress={() => setSelectedTicket(null)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            {selectedTicket && (
              <View style={{ flex: 1, backgroundColor: COLORS.background }}>
                <View style={{ padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.border }}>
                  <Text style={styles.ticketSubject}>{selectedTicket.subject}</Text>
                  <Text style={{ marginTop: 8, color: COLORS.text, lineHeight: 20 }}>{selectedTicket.description}</Text>
                </View>
                
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                  {selectedTicket.chat.map((msg, index) => (
                    <View key={index} style={[styles.chatBubble, msg.senderModel === 'Admin' ? styles.chatAdmin : styles.chatUser]}>
                      <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 4, color: msg.senderModel === 'Admin' ? COLORS.primary : COLORS.white }}>
                        {msg.senderModel === 'Admin' ? 'Support Agent' : 'You'}
                      </Text>
                      <Text style={{ color: msg.senderModel === 'Admin' ? COLORS.text : COLORS.white }}>{msg.message}</Text>
                    </View>
                  ))}
                </ScrollView>
                
                {selectedTicket.status !== 'closed' && (
                  <View style={styles.replyBox}>
                    <TextInput style={styles.replyInput} placeholder="Type a reply..." value={replyMessage} onChangeText={setReplyMessage} />
                    <TouchableOpacity style={styles.replyBtn} onPress={handleReply} disabled={replying}>
                      {replying ? <ActivityIndicator color={COLORS.white} size="small" /> : <Ionicons name="send" size={16} color={COLORS.white} style={{ marginLeft: 3 }} />}
                    </TouchableOpacity>
                  </View>
                )}
                {selectedTicket.status === 'closed' && (
                  <View style={{ padding: 16, alignItems: 'center', backgroundColor: COLORS.white }}>
                    <Text style={{ color: COLORS.textLight, fontStyle: 'italic' }}>This ticket has been closed.</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SIZES.padding, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  newTicketButton: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: SIZES.radius },
  newTicketText: { color: COLORS.white, fontWeight: "bold", marginLeft: 4 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: SIZES.padding },
  emptyTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text, marginTop: 15 },
  emptySubtitle: { fontSize: 14, color: COLORS.textLight, textAlign: "center", marginTop: 8, paddingHorizontal: 20 },
  listContainer: { padding: SIZES.padding },
  ticketCard: { backgroundColor: COLORS.white, padding: 16, borderRadius: SIZES.radius, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ticketId: { fontWeight: 'bold', color: COLORS.primary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  ticketSubject: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  ticketDate: { fontSize: 12, color: COLORS.textLight },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 12, marginBottom: 12, fontSize: 14, backgroundColor: COLORS.background },
  textArea: { height: 100 },
  submitBtn: { backgroundColor: COLORS.primary, padding: 14, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  chatBubble: { padding: 12, borderRadius: SIZES.radius, marginBottom: 10, maxWidth: '85%' },
  chatAdmin: { backgroundColor: COLORS.white, alignSelf: 'flex-start', borderBottomLeftRadius: 0, borderWidth: 1, borderColor: COLORS.border },
  chatUser: { backgroundColor: COLORS.primary, alignSelf: 'flex-end', borderBottomRightRadius: 0 },
  replyBox: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: 'center' },
  replyInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 16, marginRight: 8, height: 40, backgroundColor: COLORS.background },
  replyBtn: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});

export default SupportTicketsScreen;
