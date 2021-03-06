import chroma from 'chroma-js';
import React, { Component, CSSProperties } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { BoosterpackResource } from '../../api/api';
import { Boosterpack, Reference } from "../../models";
import { buyBoosterpack } from "../../store/actions/boosterpack";
import { BoosterpackCollection, State } from "../../store/types";
import { throttle } from '../../util/throttle';
import { abbreviate } from "../../utils";
import pokemonLogo from './pokemon-logo.png';
import './StoreFront.css';

const BUY_RATE = 1;
const BUY_BURST = 5;

interface StoreFrontProps {
    boosterpacks: BoosterpackCollection;
    boosterpackResource: BoosterpackResource;
    userPokedollars: number;
}

interface StoreFrontDispatchProps {
    onBoosterpackBuy(resource: BoosterpackResource, id: Reference<Boosterpack>): void;
}


class StoreFront extends Component<StoreFrontProps & StoreFrontDispatchProps> {

    render() {
        const bps = this.props.boosterpacks;
        const items = bps.allIds.map((id) => bps.byId[id]).map((bp) => (
            <StoreItem
                boosterpack={bp}
                key={bp.locationId}
                resource={this.props.boosterpackResource}
                onBoosterpackBuy={this.props.onBoosterpackBuy}
                available={this.props.userPokedollars >= bp.price}
            />
        ));
        return <div className="StoreFront">{items}</div>;
    }
}


interface StoreItemProps {
    boosterpack: Boosterpack;
    resource: BoosterpackResource;
    available: boolean;
}

interface StoreItemEventProps {
    onBoosterpackBuy(resource: BoosterpackResource, id: Reference<Boosterpack>): void;
}

class StoreItem extends Component<StoreItemProps & StoreItemEventProps> {
    $boosterpack?: HTMLDivElement | null;
    timeout?: number;

    onBuy(): void {
        this.props.onBoosterpackBuy(this.props.resource, this.props.boosterpack.locationId);
    }

    color(): CSSProperties {
        const color = chroma(this.props.boosterpack.hexColor);
        const white = chroma('white');
        const black = chroma('black');
        const contrastwhite = chroma.contrast(white, color);
        const contrastblack = chroma.contrast(black, color);
        const fg = contrastwhite > contrastblack ? white : black;
        let bg = color;

        if (chroma.contrast(fg, bg) < 6) {
            if (fg.hex() === "#ffffff") {
                bg = bg.darken(0.5);
            } else {
                bg = bg.brighten(0.5);
            }
        }
        const bg0 = bg.set('lch.c', Math.max(bg.get('lch.c'), 20));
        const [l, c, h] = bg0.lch();
        const bg1 = chroma.lch(l, c / 3, h);
        const bg2 = chroma.lch(l, c / 3, h - 180);
        return {
            '--bg-from': bg0.hex(),
            '--bg-via': bg1.hex(),
            '--bg-to': bg2.hex(),
            '--fg': fg.hex()
        } as CSSProperties;
    }

    render() {
        const bp = this.props.boosterpack;
        const colorProps = this.color();
        return (
            <div className="StoreItem" style={{...colorProps}}>
                <div
                    className="StoreItem-boosterpack"
                    id={`Boosterpack-${bp.locationId}`}
                    ref={(el) => this.$boosterpack = el}
                >
                    <img className="StoreItem-logo" src={pokemonLogo}/>
                    <img className="StoreItem-sprite" src={bp.pokemons && bp.pokemons[bp.pokemons.length - 1].sprite} />
                    <h3 className="StoreItem-title">{bp.name}</h3>
                </div>
                <button
                    className="StoreItem-buybutton"
                    onClick={() => {this.onBuy(); this.animate(); }}
                    disabled={!this.props.available}
                >
                    ₽{abbreviate(bp.price, 3)}
                </button>
            </div>
        );
    }

    animate() {
        if(!this.$boosterpack) {
            return;
        }
        const bp = this.$boosterpack;
        bp.style.boxShadow = "0 0 10px 10px rgba(255, 255, 255, 0.7)";
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => bp.style.boxShadow = "", 2500);
    }
}

function mapStateToProps(state: State): StoreFrontProps {
    return {
        boosterpacks: state.entities.boosterpacks,
        boosterpackResource: new BoosterpackResource(state.globalAppState.authentication.token),
        userPokedollars: state.entities.user == null ? 0 : state.entities.user.pokeDollars
    };
}

function mapDispatchToProps(dispatch: Dispatch): StoreFrontDispatchProps {
    return {
        onBoosterpackBuy: throttle(bindActionCreators(buyBoosterpack, dispatch), BUY_RATE, BUY_BURST)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreFront);
