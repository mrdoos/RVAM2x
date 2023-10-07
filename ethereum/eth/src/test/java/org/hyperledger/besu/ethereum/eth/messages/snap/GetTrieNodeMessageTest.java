/*
 * Copyright contributors to Hyperledger Besu
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
package org.hyperledger.besu.ethereum.eth.messages.snap;

import org.hyperledger.besu.datatypes.Hash;
import org.hyperledger.besu.ethereum.p2p.rlpx.wire.AbstractSnapMessageData;
import org.hyperledger.besu.ethereum.p2p.rlpx.wire.MessageData;
import org.hyperledger.besu.ethereum.p2p.rlpx.wire.RawMessage;

import java.util.ArrayList;
import java.util.List;

import org.apache.tuweni.bytes.Bytes;
import org.apache.tuweni.bytes.Bytes32;
import org.assertj.core.api.Assertions;
import org.junit.Test;

public final class GetTrieNodeMessageTest {

  @Test
  public void roundTripTest() {
    final Hash rootHash = Hash.wrap(Bytes32.random());
    final List<Bytes> paths = new ArrayList<>();
    final int hashCount = 20;
    for (int i = 0; i < hashCount; ++i) {
      paths.add(Bytes32.random());
    }

    // Perform round-trip transformation
    final MessageData initialMessage = GetTrieNodesMessage.create(rootHash, List.of(paths));
    final MessageData raw = new RawMessage(SnapV1.GET_TRIE_NODES, initialMessage.getData());

    final GetTrieNodesMessage message = GetTrieNodesMessage.readFrom(raw);

    // check match originals.
    final GetTrieNodesMessage.TrieNodesPaths response = message.paths(false);
    Assertions.assertThat(response.worldStateRootHash()).isEqualTo(rootHash);
    Assertions.assertThat(response.paths()).contains(paths);
    Assertions.assertThat(response.responseBytes()).isEqualTo(AbstractSnapMessageData.SIZE_REQUEST);
  }
}
